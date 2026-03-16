# Mystery Spin Lab - Wheel of Action 🎡

**Code Journey: Develop Yourself, Organize Your Time, Challenge Yourself.**

[Arabic Version Below]

Mystery Spin Lab is an interactive web-based application designed to gamify personal development and productivity. By spinning the "Wheel of Action," users are presented with various tasks and challenges categorized into specific growth areas.

## 🚀 Features

- **Interactive Spin Wheel**: Smooth 4s rotation with haptic-like vibration and sound effects.
- **Categorized Challenges**:
  - **Say (قول)**: Verbal expressions or communication tasks.
  - **Do (اعمل)**: Actionable items (Timed: 20s).
  - **Explore (استكشف)**: Research and discovery tasks.
  - **Try (حاول)**: New experiences and trial tasks.
  - **Challenge (تحدى)**: High-intensity growth challenges (Timed: 20s).
- **Event Cards**: Random 20% chance to encounter unique events that modify the journey.
- **Dynamic Themes**: Switch between **Matrix**, **Ocean**, and **Cyber** aesthetics.
- **Rich UI/UX**: Modern glassmorphism design, cursor glow effects, and responsive layout.

## 🛠️ Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Custom themes, animations, and glassmorphism.
- **Vanilla JavaScript**: Core game logic and AudioContext API.
- **Google Fonts**: Cairo and Rajdhani for a modern look.

## 🎮 How to Use

1. **Spin**: Click the "SPIN" button to start the wheel.
2. **Execute**: Once the wheel stops, a task from the selected category will appear.
3. **Timer**: For "Do" and "Challenge" categories, you have 20 seconds to complete the task.
4. **Events**: Watch out for special event cards that might pop up!

## 📦 Installation & Running

Since the project uses `fetch` to load `data.json`, it must be run via a local server to avoid CORS issues.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mostafanaeam/mystery-spin-lab.git
   ```
2. **Run a local server**:
   - Using VS Code: Right-click `index.html` and select **"Open with Live Server"**.
   - Using Python: `python -m http.server`
   - Using Node: `npx serve .`

---

# مختبر الغموض - عجلة الأفعال 🎡

**رحلة الكود: طوّر نفسك، نظّم وقتك، تحدّى ذاتك.**

مشروع تفاعلي يهدف إلى تحويل عملية تطوير الذات إلى تجربة ممتعة من خلال "عجلة الأفعال".

## 🚀 المميزات

- **عجلة تفاعلية**: دوران سلس مع مؤثرات صوتية واهتزاز.
- **فئات متنوعة**: (قول، اعمل، استكشف، حاول، تحدى).
- **بطاقات الأحداث**: ظهور عشوائي لبطاقات تغير مجرى التحدي.
- **سمات متعددة**: التبديل بين سمات (Matrix, Ocean, Cyber).
- **مؤقت ذكي**: للفئات التي تتطلب سرعة في التنفيذ.

## 📄 الترخيص (License)

هذا المشروع مرخص بموجب رخصة MIT - راجع ملف [LICENSE](LICENSE) لمزيد من التفاصيل.
