# 🚀 How to Start the API

## ⚠️ Requirements
- Python 3.x installed on your machine
- `pip` package manager available
- (Optional but recommended) Virtual environment (`venv`)

---

## 🖥️ Windows (CMD / PowerShell)

1. Navigate to the project root directory.
   ### Create and start virtual enviroment
2.  create the venv(virtual enviroment): 
      ```bash
      python -m venv venv
      ```
3. Activate the virtual environment:
   ```bash
   venv\Scripts\activate.bat
   ```
   > 💡 Tip: Run your terminal in **Administrator Mode** for fewer permission issues.

4. If you don’t have the dependencies installed yet, run:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

---

## 🐧 Linux / macOS

1. Open your terminal.  
2. Switch to superuser:
   ```bash
   sudo su
   ```
   ### Create and start virtual enviroment

3. **Linux / macOS**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
4. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

5. If you don’t have the dependencies installed yet, run:
   ```bash
   pip install -r requirements.txt
   ```

6. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

---

## 🛑 Important Notes
- This setup runs the API in **Development Mode only**.  
- **No database is connected yet** – data persistence is not available.  

---

✅ Now you’re ready to start coding and testing the API locally!

