# Advanced Web Calculator 🧮

This is a feature-rich web-based calculator application including an editable calculation history, light/dark themes, and adjustable history font size.

**[➡️ Live Demo Link ⬅️]((https://tapeflow.pages.dev/))**


---

## Screenshot Preview 📸

![image](https://github.com/user-attachments/assets/c2cf2232-7e73-4921-b6b1-99b504b7513a)
![image](https://github.com/user-attachments/assets/6003dcce-9156-4aed-989b-f1a2e0557b9d)

---

## ✨ Features

*   **Standard Arithmetic Operations:** Addition (`+`), Subtraction (`-`), Multiplication (`*`), Division (`/`).
*   **Percentage Calculation:** Quickly calculate percentages (`%`).
*   **Detailed Calculation History:**
    *   View previous calculation steps.
    *   Separate history panel on desktop screens.
    *   Integrated history within the display on mobile screens.
*   **Editable History:**
    *   Click on a history row (on desktop) to edit its value and operator.
    *   Delete individual rows from the history.
    *   Insert new calculation rows within the existing history.
*   **Adjustable Decimal Precision:** Set the desired number of decimal places (0-10) for results.
*   **Light/Dark Themes:** Switch between light and dark themes for better viewing. Preference is saved locally.
*   **Adjustable History Font Size:** Increase or decrease the font size in the history panel (on desktop) for better readability. Preference is saved locally.
*   **Responsive Design:** The interface adapts to different screen sizes (desktop, tablet, mobile).
*   **Keyboard Support:** Use your keyboard to input numbers and operations.
*   **AC (All Clear) Button:** Clears the current input and the entire history.
*   **Backspace Button (⌫):** Deletes the last entered character.

---

## 🛠️ Technologies Used

*   **HTML5:** Semantic structure of the page.
*   **CSS3:** Styling, layout (Grid), CSS variables for theming and responsive design.
*   **Vanilla JavaScript (ES6+):** All calculator logic, DOM manipulation, event handling, history management, local storage for preferences (theme, decimals, font size).

---

## 🚀 How to Run Locally

No complex build process or dependencies are required.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/starkweb3/TapeFlow
    ```
2.  **Navigate into the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Open the `index.html` file in your favorite web browser.**
    (Simply double-click the `index.html` file or open it via your browser's "Open File" menu.)

---

## 📁 File Structure

*   `index.html`: Contains the HTML structure of the calculator interface.
*   `styles.css`: Defines all CSS styles, including light/dark themes, responsiveness, and component styling.
*   `script.js`: Contains all the JavaScript logic for calculator functionality, history management, theme switching, font size adjustment, and event handling.

---

## 💡 Code Notes

*   The calculator logic is encapsulated within a `Calculator` class in `script.js`.
*   Preferences for theme, decimal places, and history font size are saved in `localStorage` to persist between sessions.
*   CSS variables (`:root`) are extensively used for managing themes and facilitating style modifications.
*   History management includes CRUD (Create - via calculation/insertion, Read - display, Update - edit, Delete - remove) functionalities.

---

## 🤝 Contributing

If you'd like to contribute to improving this calculator, feel free to:

*   Open an Issue to report bugs or suggest new features.
*   Create a Pull Request with your improvements.

Contributions are welcome!

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file (if available) for details.
