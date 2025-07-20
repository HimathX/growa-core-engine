import numpy as np
import os

# Get class names from filenames
filenames = np.load("filenames.npy", allow_pickle=True)
class_names = sorted(set(os.path.dirname(f) for f in filenames))
np.save("class_names.npy", class_names)