import React, { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

const YieldProgressSection = ({ onBack = () => console.log("Back button clicked") }) => {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [crops, setCrops] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [taskData, setTaskData] = useState(null);
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [selectedTaskForDetails, setSelectedTaskForDetails] = useState(null);
    const [userId, setUserId] = useState(null);

    // Get user_id from localStorage and monitor for changes
    useEffect(() => {
        const getUserId = () => {
            const storedUserId = localStorage.getItem('user_id');
            console.log('🔍 YieldProgressSection - Getting user_id from localStorage:', storedUserId);
            setUserId(storedUserId);
        };

        // Get initial user ID
        getUserId();

        // Listen for storage changes (when user logs in/out in another tab or component)
        const handleStorageChange = (e) => {
            if (e.key === 'user_id') {
                console.log('🔄 YieldProgressSection - user_id changed in localStorage:', e.newValue);
                setUserId(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when localStorage is updated in the same tab
        const handleUserChange = () => {
            getUserId();
        };

        window.addEventListener('userChanged', handleUserChange);

        // Listen for crop updates from other components
        const handleCropsUpdate = (event) => {
            console.log('🔄 YieldProgressSection - Crops updated:', event.detail);
            // Only refresh if it's for the current user
            if (event.detail.userId === localStorage.getItem('user_id')) {
                // Trigger a refresh by temporarily clearing and then setting userId
                const currentUserId = localStorage.getItem('user_id');
                if (currentUserId) {
                    setUserId(null);
                    setTimeout(() => setUserId(currentUserId), 100);
                }
            }
        };

        window.addEventListener('cropsUpdated', handleCropsUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userChanged', handleUserChange);
            window.removeEventListener('cropsUpdated', handleCropsUpdate);
        };
    }, []);

    // Fetch user crops from API
    useEffect(() => {
        const fetchCrops = async () => {
            if (!userId) {
                console.log('⚠️ No userId available, skipping crop fetch');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('🌱 Fetching crops for user:', userId);
                const response = await fetch(`http://127.0.0.1:8081/crops/user/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch crops data');
                }

                const data = await response.json();
                console.log('📦 Received crops data:', data);
                setCrops(data.crops || []);

                // Set the first crop as selected if crops exist
                if (data.crops && data.crops.length > 0) {
                    setSelectedCrop(data.crops[0]);
                } else {
                    setSelectedCrop(null);
                }
                setError(null);
            } catch (err) {
                console.error('❌ Error fetching crops:', err);
                setError(err.message);
                // Clear crops on error instead of using fallback data
                setCrops([]);
                setSelectedCrop(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCrops();
    }, [userId]); // Add userId as dependency

    // Fetch tasks for selected crop
    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedCrop || !selectedCrop._id) return;

            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8081/crops/${selectedCrop._id}/tasks`);

                if (!response.ok) {
                    throw new Error('Failed to fetch task data');
                }

                const data = await response.json();
                setTaskData(data);

                // Transform tasks to timeline format
                const transformedTasks = data.tasks.map((task, index) => {
                    // Calculate timeline position based on days_from_planting
                    const maxDays = Math.max(...data.tasks.map(t => t.days_from_planting + t.duration_days));
                    const minDays = Math.min(...data.tasks.map(t => t.days_from_planting));
                    const range = maxDays - minDays;

                    // Ensure minimum spacing between tasks (at least 10% of timeline)
                    let taskProgress;
                    if (range === 0) {
                        taskProgress = index / Math.max(1, data.tasks.length - 1);
                    } else {
                        taskProgress = Math.max(0, (task.days_from_planting - minDays) / range);
                    }

                    // Add some spacing to prevent cards at exact edges
                    taskProgress = 0.05 + (taskProgress * 0.9);

                    // Map status to type
                    let type = 'future';
                    if (task.status === 'completed') type = 'completed';
                    else if (task.status === 'overdue') type = 'missed';
                    else if (task.status === 'pending') type = 'future';

                    return {
                        id: task._id,
                        time: taskProgress,
                        title: task.task_name,
                        date: new Date(task.scheduled_start_date).toLocaleDateString(),
                        description: task.description,
                        type: type,
                        task_type: task.task_type,
                        status: task.status,
                        frequency: task.frequency,
                        duration_days: task.duration_days,
                        days_from_planting: task.days_from_planting
                    };
                }).sort((a, b) => a.days_from_planting - b.days_from_planting);

                // Apply collision detection and adjustment
                const adjustedTasks = transformedTasks.map((task, index) => {
                    let adjustedTime = task.time;

                    // Check for overlaps with previous tasks
                    for (let i = 0; i < index; i++) {
                        const prevTask = transformedTasks[i];
                        const minDistance = 0.12; // Minimum distance between tasks (12% of timeline)

                        if (Math.abs(adjustedTime - prevTask.time) < minDistance) {
                            adjustedTime = prevTask.time + minDistance;
                        }
                    }

                    // Ensure we don't exceed timeline bounds
                    adjustedTime = Math.min(0.95, Math.max(0.05, adjustedTime));

                    return {
                        ...task,
                        time: adjustedTime
                    };
                });

                setTasks(adjustedTasks);
                setError(null);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(err.message);
                // Keep existing dummy data if API fails
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [selectedCrop]);

    // Calculate progress based on completed tasks
    const getProgressPercentage = useCallback(() => {
        if (!taskData) return 0;
        return taskData.total_tasks > 0 ? (taskData.completed_tasks / taskData.total_tasks) * 100 : 0;
    }, [taskData]);

    const handleCropChange = useCallback((event) => {
        const cropId = event.target.value;
        const selected = crops.find(crop => crop._id === cropId);
        setSelectedCrop(selected);
        console.log(`Crop changed to: ${selected?.name}`);
    }, [crops]);

    const handleTaskClick = useCallback((taskId) => {
        setActiveTaskId(activeTaskId === taskId ? null : taskId);

        // Set selected task for details display
        if (activeTaskId === taskId) {
            setSelectedTaskForDetails(null);
        } else {
            const task = tasks.find(t => t.id === taskId);
            setSelectedTaskForDetails(task);
        }

        console.log(`Task clicked: ${taskId}`);
    }, [activeTaskId, tasks]);

    // Handle closing task details
    const handleCloseDetails = useCallback(() => {
        setSelectedTaskForDetails(null);
        setActiveTaskId(null);
    }, []);

    // Handle task completion
    const handleCompleteTask = useCallback(async (taskId) => {
        if (!selectedCrop || !selectedCrop._id) return;

        try {
            setLoading(true);

            // Make API call to update task status
            const response = await fetch(`http://127.0.0.1:8081/crops/${selectedCrop._id}/tasks/${taskId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'completed' })
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            // Update local state optimistically
            setTasks(prevTasks =>
                prevTasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            status: 'completed',
                            type: 'completed'
                        };
                    }
                    return task;
                })
            );

            // Update selected task for details if it's the current one
            if (selectedTaskForDetails?.id === taskId) {
                setSelectedTaskForDetails(prev => prev ? {
                    ...prev,
                    status: 'completed',
                    type: 'completed'
                } : null);
            }

            // Update task data counts
            setTaskData(prevData => prevData ? {
                ...prevData,
                completed_tasks: prevData.completed_tasks + 1
            } : null);

            console.log('Task completed successfully');

        } catch (error) {
            console.error('Error completing task:', error);
            setError(`Failed to complete task: ${error.message}`);

            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    }, [selectedCrop, selectedTaskForDetails]);

    const progressPercentage = getProgressPercentage();
    const completedTasks = tasks.filter(task => task.type === 'completed').length;

    // Show loading state
    if (loading) {
        return (
            <>
                <style>
                    {`
                        .container {
                            min-height: 100vh;
                            background-color: #f9fafb;
                            padding: 20px;
                        }
                        
                        .main-card {
                            max-width: 1152px;
                            margin: 0 auto;
                            background-color: white;
                            border-radius: 12px;
                            padding: 24px;
                            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        }

                        .header-left {
                            display: flex;
                            align-items: center;
                            gap: 20px;
                            flex-wrap: wrap;
                        }
                        
                        .back-button {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #4b5563;
                            background: none;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 6px;
                            transition: background-color 0.15s;
                            cursor: pointer;
                        }
                        
                        .back-button:hover {
                            background-color: #f3f4f6;
                        }
                        
                        .back-button-icon {
                            font-size: 18px;
                        }
                        
                        .back-button-text {
                            font-size: 16px;
                        }
                        
                        .title {
                            font-size: 24px;
                            font-weight: 600;
                            color: #1f2937;
                            margin: 0;
                        }
                        
                        .loading-spinner {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            border: 3px solid #f3f4f6;
                            border-radius: 50%;
                            border-top-color: #3b82f6;
                            animation: spin 1s ease-in-out infinite;
                        }
                        
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                        
                        .error-message {
                            color: #dc2626;
                            background-color: #fee2e2;
                            padding: 12px;
                            border-radius: 6px;
                            margin-top: 16px;
                            border: 1px solid #fecaca;
                        }

                        .auth-warning {
                            color: #d97706;
                            background-color: #fef3c7;
                            padding: 12px;
                            border-radius: 6px;
                            margin-top: 16px;
                            border: 1px solid #fbbf24;
                        }
                    `}
                </style>
                <div className="container">
                    <div className="main-card">
                        <div className="header-left">
                            <button onClick={onBack} className="back-button">
                                <span className="back-button-icon">←</span>
                                <span className="back-button-text">{t('yieldProgress')}</span>
                            </button>
                            <h1 className="title">
                                <span className="loading-spinner"></span>
                                {userId ? t('loadingCrops') : 'Please log in to view your crops'}
                            </h1>
                        </div>
                        {!userId && (
                            <div className="auth-warning">
                                No user authentication found. Please log in to access your crop data.
                            </div>
                        )}
                        {error && (
                            <div className="error-message">
                                {t('errorOccurred')}: {error}
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Show message if no user is logged in
    if (!userId) {
        return (
            <>
                <style>
                    {`
                        .container {
                            min-height: 100vh;
                            background-color: #f9fafb;
                            padding: 20px;
                        }
                        
                        .main-card {
                            max-width: 1152px;
                            margin: 0 auto;
                            background-color: white;
                            border-radius: 12px;
                            padding: 24px;
                            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        }

                        .header-left {
                            display: flex;
                            align-items: center;
                            gap: 20px;
                            flex-wrap: wrap;
                        }
                        
                        .back-button {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #4b5563;
                            background: none;
                            border: none;
                            padding: 8px 12px;
                            border-radius: 6px;
                            transition: background-color 0.15s;
                            cursor: pointer;
                        }
                        
                        .back-button:hover {
                            background-color: #f3f4f6;
                        }
                        
                        .back-button-icon {
                            font-size: 18px;
                        }
                        
                        .back-button-text {
                            font-size: 16px;
                        }
                        
                        .title {
                            font-size: 24px;
                            font-weight: 600;
                            color: #1f2937;
                            margin: 0;
                        }
                        
                        .auth-required {
                            text-align: center;
                            padding: 60px 20px;
                            color: #6b7280;
                        }
                        
                        .auth-required h3 {
                            font-size: 18px;
                            margin-bottom: 8px;
                            color: #374151;
                        }
                        
                        .auth-required p {
                            font-size: 14px;
                            margin: 0;
                        }
                    `}
                </style>
                <div className="container">
                    <div className="main-card">
                        <div className="header-left">
                            <button onClick={onBack} className="back-button">
                                <span className="back-button-icon">←</span>
                                <span className="back-button-text">{t('yieldProgress')}</span>
                            </button>
                            <h1 className="title">Authentication Required</h1>
                        </div>
                        <div className="auth-required">
                            <h3>Please Log In</h3>
                            <p>You need to be logged in to view your crop progress and tasks.</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <style>
                {`
                    .container {
                        min-height: 100vh;
                        background-color: #f9fafb;
                        padding: 20px;
                    }
                    
                    .main-card {
                        max-width: 1152px;
                        margin: 0 auto;
                        background-color: white;
                        border-radius: 12px;
                        padding: 24px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    }


                    
                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        flex-wrap: wrap;
                        flex: 1;
                    }
                    
                    .back-button {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #4b5563;
                        background: none;
                        border: none;
                        padding: 8px 12px;
                        border-radius: 6px;
                        transition: background-color 0.15s;
                        cursor: pointer;
                    }
                    
                    .back-button:hover {
                        background-color: #f3f4f6;
                    }
                    
                    .back-button-icon {
                        font-size: 18px;
                    }
                    
                    .back-button-text {
                        font-size: 16px;
                    }
                    
                    .title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0;
                    }
                    
                    .crop-selector {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        background-color: #f9fafb;
                        padding: 8px 12px;
                        border-radius: 8px;
                    }
                    
                    .crop-emoji {
                        font-size: 18px;
                    }
                    
                    .crop-select {
                        background: transparent;
                        border: none;
                        font-size: 16px;
                        cursor: pointer;
                        outline: none;
                    }
                    
                    .timeline-container {
                        position: relative;
                        min-height: 500px;
                        margin: 40px 0;
                        padding: 0 140px;
                        overflow-x: auto;
                        overflow-y: visible;
                    }
                    
                    .timeline-bar {
                        position: absolute;
                        top: 50%;
                        left: 120px;
                        right: 120px;
                        height: 6px;
                        background-color: #e5e7eb;
                        border-radius: 3px;
                        transform: translateY(-50%);
                        min-width: 600px;
                        box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
                    }
                    
                    .timeline-progress {
                        height: 100%;
                        background: linear-gradient(135deg, #10b981, #059669);
                        border-radius: 3px;
                        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
                    }
                    
                    .timeline-node {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                    
                    .timeline-marker {
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        border: 4px solid white;
                        transform: translate(-50%, -50%);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        z-index: 10;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                        cursor: pointer;
                    }
                    
                    .timeline-marker:hover {
                        transform: translate(-50%, -50%) scale(1.2);
                        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                    }
                    
                    .timeline-marker.active {
                        transform: translate(-50%, -50%) scale(1.3);
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                        z-index: 15;
                    }
                    
                    .timeline-marker.completed {
                        background-color: #10b981;
                        border-color: #d1fae5;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                    }
                    
                    .timeline-marker.completed:hover {
                        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
                    }
                    
                    .timeline-marker.completed.active {
                        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.6);
                    }
                    
                    .timeline-marker.incomplete {
                        background-color: #9ca3af;
                        border-color: #f3f4f6;
                        box-shadow: 0 2px 6px rgba(156, 163, 175, 0.3);
                    }
                    
                    .timeline-marker.incomplete:hover {
                        box-shadow: 0 4px 12px rgba(156, 163, 175, 0.4);
                    }
                    
                    .timeline-marker.incomplete.active {
                        box-shadow: 0 6px 16px rgba(156, 163, 175, 0.5);
                    }
                    
                    .card-wrapper {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 5;
                        transition: z-index 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    
                    .card-wrapper.active {
                        z-index: 20;
                    }
                    
                    .card-wrapper.top {
                        bottom: 35px;
                    }
                    
                    .card-wrapper.bottom {
                        top: 35px;
                    }
                    
                    .connector-line {
                        position: absolute;
                        left: 50%;
                        width: 2px;
                        height: 25px;
                        transform: translateX(-50%);
                        background: linear-gradient(to bottom, 
                            #cbd5e0 0%, 
                            transparent 50%, 
                            #cbd5e0 50%, 
                            transparent 100%
                        );
                        background-size: 2px 8px;
                        opacity: 0.6;
                    }
                    
                    .connector-line.top {
                        top: 100%;
                    }
                    
                    .connector-line.bottom {
                        bottom: 100%;
                    }
                    
                    .stage-card {
                        width: 270px;
                        background-color: white;
                        border: 1px solid #e5e7eb;
                        border-radius: 12px;
                        padding: 16px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        margin: 0 6px;
                        backdrop-filter: blur(10px);
                    }
                    
                    .stage-card:hover {
                        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                        transform: translateY(-6px);
                        border-color: #d1d5db;
                    }
                    
                    .stage-card.active {
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        transform: translateY(-8px) scale(1.05);
                        border-color: #3b82f6;
                        border-width: 2px;
                    }
                    
                    .stage-card.missed {
                        border-color: #f87171;
                        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                        border-width: 2px;
                    }
                    
                    .stage-card.future {
                        border-color: #d1d5db;
                        background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                        opacity: 0.85;
                    }
                    
                    .stage-card.completed {
                        border-color: #10b981;
                        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                        border-width: 2px;
                    }
                    
                    .card-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 8px;
                    }
                    
                    .card-title {
                        font-size: 15px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0;
                        line-height: 1.3;
                    }
                    
                    .card-date {
                        font-size: 11px;
                        color: #6b7280;
                        background-color: #f3f4f6;
                        padding: 3px 8px;
                        border-radius: 10px;
                        font-weight: 500;
                        letter-spacing: 0.025em;
                    }
                    
                    .card-description {
                        font-size: 13px;
                        color: #4b5563;
                        line-height: 1.5;
                        margin: 0;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    
                    .task-meta {
                        display: flex;
                        gap: 8px;
                        margin-bottom: 8px;
                        flex-wrap: wrap;
                    }
                    
                    .task-type,
                    .task-status,
                    .task-frequency {
                        font-size: 11px;
                        padding: 2px 6px;
                        border-radius: 4px;
                        text-transform: uppercase;
                        font-weight: 500;
                    }
                    
                    .task-type {
                        background-color: #e0e7ff;
                        color: #3730a3;
                    }
                    
                    .task-status {
                        background-color: #f3f4f6;
                        color: #374151;
                    }
                    
                    .task-status.completed {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    
                    .task-status.pending {
                        background-color: #fef3c7;
                        color: #92400e;
                    }
                    
                    .task-status.overdue {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    
                    .task-frequency {
                        background-color: #f0f9ff;
                        color: #0c4a6e;
                    }
                    
                    .no-tasks {
                        text-align: center;
                        padding: 60px 20px;
                        color: #6b7280;
                    }
                    
                    .no-tasks h3 {
                        font-size: 18px;
                        margin-bottom: 8px;
                        color: #374151;
                    }
                    
                    .no-tasks p {
                        font-size: 14px;
                        margin: 0;
                    }
                    
                    .timeline-scroll-hint {
                        text-align: center;
                        color: #6b7280;
                        font-size: 12px;
                        margin-top: 16px;
                        opacity: 0.7;
                    }
                    
                    .stage-details-container {
                        margin-top: 40px;
                        background-color: white;
                        border-radius: 12px;
                        padding: 32px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                        border: 2px solid #e5e7eb;
                        transition: all 0.3s ease;
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .stage-details-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 24px;
                        gap: 16px;
                    }
                    
                    .stage-details-title-section {
                        flex: 1;
                    }
                    
                    .stage-details-title {
                        font-size: 28px;
                        font-weight: 700;
                        color: #1f2937;
                        margin: 0 0 8px 0;
                        line-height: 1.2;
                    }
                    
                    .stage-details-subtitle {
                        font-size: 16px;
                        color: #6b7280;
                        margin: 0;
                        font-weight: 500;
                    }
                    
                    .stage-details-actions {
                        display: flex;
                        gap: 12px;
                        align-items: center;
                    }
                    
                    .close-details-button {
                        padding: 8px;
                        background: none;
                        border: 1px solid #d1d5db;
                        border-radius: 8px;
                        cursor: pointer;
                        color: #6b7280;
                        transition: all 0.15s;
                        font-size: 18px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-width: 40px;
                        height: 40px;
                    }
                    
                    .close-details-button:hover {
                        background-color: #f3f4f6;
                        border-color: #9ca3af;
                        color: #374151;
                    }
                    
                    .complete-task-button {
                        padding: 12px 20px;
                        background: linear-gradient(135deg, #10b981, #059669);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.15s;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 14px;
                    }
                    
                    .complete-task-button:hover {
                        background: linear-gradient(135deg, #059669, #047857);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                    }
                    
                    .complete-task-button:disabled {
                        background: #9ca3af;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }
                    
                    .stage-details-content {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 32px;
                        margin-bottom: 24px;
                    }
                    
                    .stage-details-info {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .info-group {
                        background-color: #f9fafb;
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid #e5e7eb;
                    }
                    
                    .info-group-title {
                        font-size: 14px;
                        font-weight: 600;
                        color: #374151;
                        margin: 0 0 12px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 8px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    
                    .info-label {
                        font-size: 14px;
                        color: #6b7280;
                        font-weight: 500;
                    }
                    
                    .info-value {
                        font-size: 14px;
                        color: #1f2937;
                        font-weight: 600;
                    }
                    
                    .status-badge {
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    
                    .status-badge.completed {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    
                    .status-badge.pending {
                        background-color: #fef3c7;
                        color: #92400e;
                    }
                    
                    .status-badge.overdue {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    
                    .stage-description {
                        background-color: #f8fafc;
                        padding: 20px;
                        border-radius: 10px;
                        border-left: 4px solid #3b82f6;
                    }
                    
                    .stage-description-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1f2937;
                        margin: 0 0 12px 0;
                    }
                    
                    .stage-description-text {
                        font-size: 15px;
                        color: #4b5563;
                        line-height: 1.6;
                        margin: 0;
                    }
                    
                    @media (max-width: 768px) {
                        .header {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 16px;
                        }
                        
                        .header-left {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 12px;
                            width: 100%;
                        }
                        
                        .timeline-container {
                            padding: 0 20px;
                        }
                        
                        .timeline-bar {
                            left: 20px;
                            right: 20px;
                        }
                        
                        .stage-card {
                            width: 220px;
                        }
                        
                        .stage-details-container {
                            margin-top: 20px;
                            padding: 20px;
                        }
                        
                        .stage-details-header {
                            flex-direction: column;
                            align-items: stretch;
                            gap: 16px;
                        }
                        
                        .stage-details-actions {
                            justify-content: space-between;
                        }
                        
                        .stage-details-content {
                            grid-template-columns: 1fr;
                            gap: 20px;
                        }
                        
                        .stage-details-title {
                            font-size: 24px;
                        }
                    }
                `}
            </style>

            <div className="container">
                <div className="main-card">
                    {/* Header */}
                    <div className="header">
                        <div className="header-left">
                            <button onClick={onBack} className="back-button">
                                <span className="back-button-icon">←</span>
                                <span className="back-button-text">{t('yieldProgress')}</span>
                            </button>

                            <h1 className="title">
                                {!userId ?
                                    'Please log in to view your crops' :
                                    crops.length === 0 ?
                                        'No crops found - Create some crops first!' :
                                        taskData ?
                                            `${taskData.completed_tasks}/${taskData.total_tasks} ${t('tasksCompleted')}` :
                                            t('goingGreat')
                                }
                            </h1>

                            {crops.length > 0 && (
                                <div className="crop-selector">
                                    <span className="crop-emoji">🌱</span>
                                    <select
                                        value={selectedCrop?._id || ''}
                                        onChange={handleCropChange}
                                        className="crop-select"
                                        disabled={loading}
                                    >
                                        {crops.map(crop => (
                                            <option key={crop._id} value={crop._id}>
                                                {crop.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="timeline-container">
                        {crops.length === 0 ? (
                            <div className="no-tasks">
                                <h3>No Crops Found</h3>
                                <p>You haven't created any crops yet. Go to the Plan section to add your first crop!</p>
                                <button
                                    onClick={() => window.history.back()}
                                    style={{
                                        marginTop: '16px',
                                        padding: '8px 16px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Go to Plan Section
                                </button>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="no-tasks">
                                <h3>No tasks found for this crop</h3>
                                <p>Tasks will appear here when available for the selected crop.</p>
                            </div>
                        ) : (
                            <>
                                {/* Timeline bar */}
                                <div className="timeline-bar">
                                    <div
                                        className="timeline-progress"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>

                                {/* Timeline nodes and cards */}
                                {tasks.map((task, index) => {
                                    const isCompleted = task.type === 'completed';
                                    const isTop = index % 2 !== 0;
                                    const isActive = activeTaskId === task.id;

                                    // Calculate position relative to the timeline bar (which has margins)
                                    const leftPosition = `calc(120px + ${task.time} * (100% - 240px))`;

                                    return (
                                        <div
                                            key={task.id}
                                            className="timeline-node"
                                            style={{ left: leftPosition }}
                                        >
                                            {/* Timeline marker */}
                                            <div
                                                className={`timeline-marker ${isCompleted ? 'completed' : 'incomplete'}${isActive ? ' active' : ''}`}
                                                onClick={() => handleTaskClick(task.id)}
                                            />

                                            {/* Card wrapper */}
                                            <div className={`card-wrapper ${isTop ? 'top' : 'bottom'}${isActive ? ' active' : ''}`}>
                                                {/* Dashed connector line */}
                                                <div className={`connector-line ${isTop ? 'top' : 'bottom'}`} />

                                                {/* Task card */}
                                                <div className={`stage-card ${task.type}${isActive ? ' active' : ''}`}>
                                                    <div className="card-header">
                                                        <h4 className="card-title">{task.title}</h4>
                                                        <span className="card-date">{task.date}</span>
                                                    </div>
                                                    <div className="task-meta">
                                                        <span className="task-type">{task.task_type}</span>
                                                        <span className={`task-status ${task.status}`}>{task.status}</span>
                                                        {task.frequency !== 'once' && (
                                                            <span className="task-frequency">{task.frequency}</span>
                                                        )}
                                                    </div>
                                                    <p className="card-description">{task.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}

                        {tasks.length > 6 && (
                            <div className="timeline-scroll-hint">
                                Scroll horizontally to view all tasks →
                            </div>
                        )}
                    </div>

                    {/* Stage Details Section */}
                    {selectedTaskForDetails && (
                        <div className="stage-details-container">
                            <div className="stage-details-header">
                                <div className="stage-details-title-section">
                                    <h2 className="stage-details-title">{selectedTaskForDetails.title}</h2>
                                    <p className="stage-details-subtitle">
                                        {selectedTaskForDetails.task_type} • Day {selectedTaskForDetails.days_from_planting} from planting
                                    </p>
                                </div>
                                <div className="stage-details-actions">
                                    {selectedTaskForDetails.status !== 'completed' && (
                                        <button
                                            className="complete-task-button"
                                            onClick={() => handleCompleteTask(selectedTaskForDetails.id)}
                                            disabled={loading}
                                        >
                                            <span>✓</span>
                                            {loading ? 'Completing...' : 'Mark Complete'}
                                        </button>
                                    )}
                                    <button
                                        className="close-details-button"
                                        onClick={handleCloseDetails}
                                        title="Close details"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="stage-details-content">
                                <div className="stage-details-info">
                                    <div className="info-group">
                                        <h3 className="info-group-title">Task Information</h3>
                                        <div className="info-row">
                                            <span className="info-label">Status</span>
                                            <span className={`status-badge ${selectedTaskForDetails.status}`}>
                                                {selectedTaskForDetails.status}
                                            </span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Frequency</span>
                                            <span className="info-value">{selectedTaskForDetails.frequency}</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Duration</span>
                                            <span className="info-value">{selectedTaskForDetails.duration_days} days</span>
                                        </div>
                                        <div className="info-row">
                                            <span className="info-label">Scheduled Date</span>
                                            <span className="info-value">{selectedTaskForDetails.date}</span>
                                        </div>
                                    </div>

                                    {selectedTaskForDetails.status === 'completed' && (
                                        <div className="info-group">
                                            <h3 className="info-group-title">Completion Status</h3>
                                            <div className="info-row">
                                                <span className="info-label">Completed</span>
                                                <span className="info-value">✓ Task completed successfully</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="stage-description">
                                    <h3 className="stage-description-title">Task Description</h3>
                                    <p className="stage-description-text">
                                        {selectedTaskForDetails.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default YieldProgressSection;