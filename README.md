# ASL APP 


## React Native

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (>= 12.0.0)
- [Yarn](https://yarnpkg.com/) (optional, but recommended)
- [React Native CLI](https://reactnative.dev/docs/environment-setup) or use [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/catalog2003/aslfinal/
    
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    # or if you use Yarn
    yarn install
    ```

3. **Run the Project:**

    - **For iOS (requires macOS):**

        ```bash
        npx react-native run-ios
        ```

    - **For Android:**

        ```bash
        npx react-native run-android
        ```

    - **For Expo (if using Expo CLI):**

        ```bash
        expo start
        ```

### Common Issues

- **Issue with package installation:** Try deleting `node_modules` and `package-lock.json` (or `yarn.lock`), then run `npm install` (or `yarn install`) again.
- **Simulator/Emulator not working:** Ensure you have set up the Android Emulator or iOS Simulator correctly.

---

## Python

### Prerequisites

Ensure you have Python installed (>= 3.6). You can download it from [python.org](https://www.python.org/).

### Setting Up a Virtual Environment

1. **Create and Activate Virtual Environment:**

    ```bash
    python -m venv venv
    ```

    - **Windows:**

        ```bash
        .\venv\Scripts\activate
        ```

    - **macOS/Linux:**

        ```bash
        source venv/bin/activate
        ```

2. **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

### Running the Project

- **Run a Python script (replace `script.py` with your script):**

    ```bash
    python script.py
    ```

### Common Issues

- **Dependency conflicts:** Ensure your `requirements.txt` file is up-to-date. You can regenerate it with `pip freeze > requirements.txt`.
- **Virtual environment issues:** Ensure it is activated before running Python commands.

---
