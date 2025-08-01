import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const YieldProgressCard = ({ onClick }) => {
    const { t } = useTranslation();
    const [crops, setCrops] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState(null);

    // For now, using a placeholder user ID - this should come from authentication context
    const userId = "688c5b21602eb74a8f86f9bc";

    // Fetch user crops from API
    useEffect(() => {
        const fetchCrops = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://127.0.0.1:8081/crops/user/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch crops data');
                }

                const data = await response.json();
                setCrops(data.crops || []);

                // Set the first crop as selected if crops exist
                if (data.crops && data.crops.length > 0) {
                    setSelectedCrop(data.crops[0]);
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching crops:', err);
                setError(err.message);
                // Fallback to dummy data
                setCrops([
                    { _id: "1", name: "Carrots", crop_type: "CARROT", progress_percentage: 45, current_phase: "Growing" },
                    { _id: "2", name: "Potatoes", crop_type: "POTATO", progress_percentage: 70, current_phase: "Maturing" },
                    { _id: "3", name: "Tomatoes", crop_type: "TOMATO", progress_percentage: 30, current_phase: "Seedling" }
                ]);
                setSelectedCrop({ _id: "1", name: "Carrots", crop_type: "CARROT", progress_percentage: 45, current_phase: "Growing" });
            } finally {
                setLoading(false);
            }
        };

        fetchCrops();
    }, [userId]);

    // Fetch tasks for selected crop
    useEffect(() => {
        const fetchTasks = async () => {
            if (!selectedCrop || !selectedCrop._id) {
                setTasks([]);
                setTaskData(null);
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8081/crops/${selectedCrop._id}/tasks`);

                if (!response.ok) {
                    throw new Error('Failed to fetch task data');
                }

                const data = await response.json();
                setTaskData(data);

                // Transform tasks and sort by days_from_planting
                const transformedTasks = data.tasks.map((task) => {
                    // Map status to type for consistency with existing UI
                    let type = 'future';
                    if (task.status === 'completed') type = 'completed';
                    else if (task.status === 'overdue') type = 'missed';
                    else if (task.status === 'pending') type = 'future';

                    return {
                        id: task._id,
                        title: task.task_name,
                        description: task.description,
                        type: type,
                        task_type: task.task_type,
                        status: task.status,
                        date: new Date(task.scheduled_start_date).toLocaleDateString(),
                        days_from_planting: task.days_from_planting,
                        scheduled_start_date: task.scheduled_start_date
                    };
                }).sort((a, b) => a.days_from_planting - b.days_from_planting);

                setTasks(transformedTasks);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                // Fallback to empty tasks if API fails
                setTasks([]);
                setTaskData(null);
            }
        };

        fetchTasks();
    }, [selectedCrop]);

    // Helper function to get the last completed task
    const getLastCompletedTask = () => {
        const completedTasks = tasks.filter(task => task.status === 'completed');
        return completedTasks.length > 0 ? completedTasks[completedTasks.length - 1] : null;
    };

    // Helper function to get upcoming tasks (next 2-3 pending/overdue tasks)
    const getUpcomingTasks = () => {
        const upcomingTasks = tasks.filter(task =>
            task.status === 'pending' || task.status === 'overdue'
        );
        return upcomingTasks.slice(0, 2); // Get next 2 upcoming tasks
    };

    // Helper function to get milestones for display
    const getMilestonesForDisplay = () => {
        const milestones = [];

        // Add last completed task
        const lastCompleted = getLastCompletedTask();
        if (lastCompleted) {
            milestones.push({
                id: `completed-${lastCompleted.id}`,
                title: `✓ ${lastCompleted.title}`,
                description: `Completed: ${lastCompleted.task_type}`,
                type: 'completed'
            });
        }

        // Add upcoming tasks
        const upcoming = getUpcomingTasks();
        upcoming.forEach((task, index) => {
            milestones.push({
                id: `upcoming-${task.id}`,
                title: task.title,
                description: `${task.task_type} • ${task.date}`,
                type: task.type
            });
        });

        // If no tasks available, show a placeholder
        if (milestones.length === 0) {
            milestones.push({
                id: 'no-tasks',
                title: t('noTasksAvailable'),
                description: t('startPlanning'),
                type: 'future'
            });
        }

        return milestones;
    };

    const handleDropdownClick = () => {
        setDropdownOpen((open) => !open);
    };

    const handleCropSelect = (crop) => {
        setSelectedCrop(crop);
        setDropdownOpen(false);
    };

    // Calculate progress based on completed tasks from backend data
    const progressPercentage = taskData && taskData.total_tasks > 0
        ? (taskData.completed_tasks / taskData.total_tasks) * 100
        : (selectedCrop ? Math.max(0, selectedCrop.progress_percentage || 0) : 0);

    // Get milestones for display
    const displayMilestones = getMilestonesForDisplay();

    // If loading, show loading state
    if (loading) {
        return (
            <div className="card yield-progress-card">
                <div className="card-header">
                    <h3 className="card-title">{t('yieldProgress')}</h3>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</div>
                    <p>{t('loadingCrops')}</p>
                </div>
            </div>
        );
    }

    // If no crops available, show empty state
    if (!selectedCrop || crops.length === 0) {
        return (
            <div className="card yield-progress-card">
                <div className="card-header">
                    <h3 className="card-title" onClick={onClick}>
                        {t('yieldProgress')}
                    </h3>
                    <span className="card-arrow" onClick={onClick}></span>
                </div>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🌱</div>
                    <p>{t('noCropsFound')}</p>
                    {error && (
                        <p style={{ color: '#ef6c00', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            {t('errorOccurred')}: {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="card yield-progress-card">
            <div className="card-header">
                <h3 className="card-title" onClick={onClick}>
                    {t('yieldProgress')}
                </h3>
                <span className="card-arrow" onClick={onClick}></span>
            </div>

            {error && (
                <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 152, 0, 0.1)',
                    borderTop: '1px solid rgba(255, 152, 0, 0.3)',
                    fontSize: '0.8rem',
                    color: '#ef6c00'
                }}>
                    ⚠️ {t('loading')} - {error}
                </div>
            )}

            <div className="crop-selector" onClick={handleDropdownClick} style={{ position: "relative", cursor: "pointer" }}>
                <span className="icon">🌱</span> {selectedCrop.name} ({selectedCrop.crop_type}){" "}
                <span style={{ marginLeft: "5px" }}>▼</span>
                {dropdownOpen && (
                    <div className="dropdown-list" style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 10,
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto"
                    }}>
                        {crops.map((crop) => (
                            <div
                                key={crop._id}
                                className="dropdown-item"
                                style={{
                                    padding: "12px",
                                    cursor: "pointer",
                                    background: crop._id === selectedCrop._id ? "#f0f0f0" : "#fff",
                                    borderBottom: "1px solid #eee"
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCropSelect(crop);
                                }}
                            >
                                <div style={{ fontWeight: "600" }}>{crop.name}</div>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                    {crop.crop_type} • {crop.current_phase || 'Active'}
                                </div>
                                {crop._id === selectedCrop._id && taskData && (
                                    <div style={{ fontSize: "0.7rem", color: "#10b981", marginTop: "2px" }}>
                                        {taskData.completed_tasks}/{taskData.total_tasks} tasks completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="status-text">
                {taskData ?
                    `${taskData.completed_tasks}/${taskData.total_tasks} tasks completed` :
                    `${selectedCrop.current_phase} - ${selectedCrop.status}`
                }
            </p>

            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${Math.max(0, progressPercentage)}%` }}
                ></div>
                <span style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.8rem',
                    color: '#666'
                }}>
                    {taskData ?
                        `${taskData.completed_tasks}/${taskData.total_tasks}` :
                        `${Math.max(0, progressPercentage).toFixed(1)}%`
                    }
                </span>
            </div>

            <div className="yield-milestones-container">
                {displayMilestones.map((milestone) => (
                    <div
                        key={milestone.id}
                        className={`milestone-item ${milestone.type}`}
                    >
                        <h4>{milestone.title}</h4>
                        <p>{milestone.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YieldProgressCard;