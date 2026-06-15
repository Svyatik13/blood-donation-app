export const translations = {
  cs: {
    // Login & Register
    login_title: 'Krevní Život',
    login_subtitle: 'Zachraňte život ještě dnes',
    phone_placeholder: '+420 123 456 789',
    password_placeholder: 'Heslo',
    login_btn: 'Přihlásit se',
    no_account: 'Nemáte účet? Zaregistrujte se',
    register_title: 'Registrace',
    step_personal: 'Osobní údaje',
    step_contacts: 'Kontakty',
    step_medical: 'Zdravotní',
    surname: 'Příjmení',
    name: 'Jméno',
    middlename: 'Otčestvo (nepovinné)',
    dob: 'Datum narození',
    gender: 'Pohlaví',
    male: 'Muž',
    female: 'Žena',
    email: 'Email',
    passport: 'Číslo pasu / OP',
    address: 'Adresa',
    password_create: 'Vytvořte heslo',
    blood_group: 'Krevní skupina',
    weight: 'Váha (kg)',
    chronic_diseases: 'Chronická onemocnění',
    allergies: 'Alergie',
    medications: 'Užívané léky',
    none_placeholder: 'Ne',
    btn_back: 'Zpět',
    btn_next: 'Dále',
    btn_create_account: 'Vytvořit účet',
    have_account: 'Máte už účet? Přihlaste se',
    login_error: 'Chyba přihlášení',
    test_mode: 'Testovací režim',

    // App Navigation
    nav_home: 'Hlavní',
    nav_history: 'Historie',
    nav_profile: 'Profil',

    // Home & Gamification
    greeting: 'Dobrý den,',
    donor_path: 'Cesta dárce',
    donations_count: 'Počet darování',
    next_donation_ready: 'Dnes můžete darovat krev!',
    next_donation_date: 'Další darování možné od:',
    btn_check_in: 'Jsem zde — Zapsat se',
    
    milestone_1: 'První krok',
    milestone_5: 'Bronzový dárce',
    milestone_10: 'Stříbrný dárce',
    milestone_20: 'Zlatý dárce',
    current_level: 'Aktuální úroveň',
    donations_left: 'Zbývá darování: {count}',

    // QR Code
    qr_show_hint: 'Ukažte tento QR kód na recepci',
    qr_your_id: 'Váš identifikátor',

    // Profile
    profile_phone: 'Telefon',
    profile_logout: 'Odhlásit se',

    // Status Screen
    status_queue_title: 'Vaše číslo:',
    status_queue_desc: 'Prosím, vyplňte zdravotní dotazník.',
    btn_fill_questionnaire: 'Vyplnit dotazník',
    
    status_questionnaire_title: 'Dotazník vyplněn',
    status_questionnaire_desc: 'Odevzdejte prosím doklady na recepci.',
    
    status_prep_title: 'Probíhá příprava',
    status_prep_desc: 'Řiďte se prosím pokyny personálu.',
    
    status_awaiting_title: 'Čekáme na výsledky',
    status_awaiting_desc: 'Váš krevní vzorek se právě analyzuje.',
    
    status_donating_title: 'Probíhá odběr',
    status_donating_desc: 'Odpočívejte. Lékař se o vás postará.',
    
    status_completed_title: 'Děkujeme!',
    status_completed_desc: 'Vaše darování je dokončeno. Jste hrdina! ❤️',
    
    status_rejected_title: 'Zdravotní odklad',
    status_rejected_desc: 'Bohužel dnes nemůžete darovat krev.',
    status_rejection_reason: 'Důvod:',
    btn_understand: 'Rozumím',

    // Questionnaire
    q_title: 'Zdravotní dotazník',
    q_q1: 'Cítíte se dnes zdráv/a?',
    q_q2: 'Měl/a jste v posledních 2 týdnech horečku?',
    q_q3: 'Bral/a jste v posledních 3 dnech léky proti bolesti?',
    q_q4: 'Byl/a jste v posledních 6 měsících v zahraničí mimo Evropu?',
    q_q5: 'Měl/a jste někdy infekční žloutenku, syfilis nebo HIV?',
    q_q6: 'Podstoupil/a jste v posledních 6 měsících tetování nebo piercing?',
    q_yes: 'Ano',
    q_no: 'Ne',
    btn_submit_q: 'Odeslat dotazník',

    // Donor Path Modal
    path_start: 'Start',
    path_start_desc: 'Vaše cesta začíná',
    path_desc_1: 'První darování krve',
    path_desc_5: 'Bronzová medaile hrdiny',
    path_desc_10: 'Stříbrná medaile hrdiny',
    path_desc_20: 'Zlatá medaile hrdiny',
    path_milestone_50: 'Diamantový dárce',
    path_desc_50: 'Nejvyšší ocenění za záchranu životů',
    path_donation_singular: 'donace',
    path_donation_plural: 'donací',
    path_reached: 'Dosaženo',
    path_remaining: 'Zbývá:',

    // Landing Page
    landing_title: 'Krevní Život',
    landing_subtitle: 'Vyberte svou roli v systému',
    landing_donor: 'Dárce',
    landing_donor_desc: 'Mobilní aplikace pro pacienty: rezervace, dotazník, cesta dárce.',
    landing_reception: 'Recepce',
    landing_reception_desc: 'Kontrola dokladů totožnosti, registrace příchozích pacientů.',
    landing_doctor: 'Lékař',
    landing_doctor_desc: 'Fronta na vyšetření, schválení a sledování odběrů krve.',

    // Scanner (hardware simulator)
    scanner_title: 'Skener recepce',
    scanner_desc: 'Simulace fyzického přiložení telefonu k terminálu kliniky.',
    scanner_btn: 'SIMULOVAT',
    scanner_success_title: 'Úspěšný sken!',
    scanner_success_desc: 'Pacient se objevil na recepci. Nyní musí administrátor zkontrolovat doklad.',

    // Reception Dashboard
    reception_title: 'Recepce',
    reception_waiting: 'Čekají na registraci',
    reception_panel_title: 'Panel recepce',
    reception_panel_desc: 'Kontrola dokladů a registrace dárců',
    reception_search_placeholder: 'Hledat podle příjmení nebo ID...',
    reception_search_results: 'Výsledky hledání',
    reception_not_found: 'Nic nebylo nalezeno',
    reception_pending: 'Čekají na zpracování',
    reception_all_done: 'Všichni pacienti jsou zpracováni',
    reception_id_doc: 'Doklad totožnosti:',
    reception_blood_group: 'Krevní skupina:',
    reception_verify: 'Ověřit totožnost (Check-in)',
    reception_done: 'Zpracováno',

    // Doctor Dashboard
    doc_sidebar_queue: 'Fronta',
    doc_sidebar_active: 'Aktivní',
    doc_sidebar_completed: 'Dokončené',
    doc_sidebar_search: 'Hledání',
    doc_sidebar_reset: 'Obnovit data',

    doc_stats_queue: 'Ve frontě',
    doc_stats_active: 'Aktivní odběry',
    doc_stats_rejected: 'Odmítnuto',
    doc_stats_completed: 'Završeno',
    doc_stats_volume: 'Objem krve',

    doc_queue_empty: 'Fronta je prázdná',
    doc_active_empty: 'Žádné aktivní odběry',
    doc_completed_empty: 'Zatím žádní dárci',

    doc_btn_docs_ok: 'Doklady přijaty',
    doc_btn_start_pressure: 'Začít měřit tlak',
    doc_btn_sample_taken: 'Vzorek odebrán',
    doc_btn_results_ok: 'Výsledky hotové',
    doc_btn_reject: 'Odklad',
    doc_btn_approve: 'Pustit k odběru',
    doc_btn_finish_donation: 'Dokončit odběr',

    doc_modal_title_pers: 'Osobní údaje',
    doc_modal_title_med: 'Zdravotní informace',
    doc_modal_title_visit: 'Aktuální návštěva',
    doc_modal_title_hist: 'Historie darování',
    doc_modal_no_records: 'Žádné záznamy',
    doc_modal_notes: 'Poznámky lékaře...',
    doc_btn_save: 'Uložit',

    // Doctor search
    doc_search_placeholder: 'Hledat podle jména, telefonu, skupiny krve...',
    doc_search_empty: 'Zadejte dotaz pro vyhledávání dárců',
    doc_search_no_results: 'Nic nebylo nalezeno pro dotaz «{query}»',
    doc_search_results: 'Výsledky',
    doc_search_donations: 'Donací',

    // Doctor queue inline texts
    doc_click_answers: '(Klikněte pro zobrazení odpovědí)',
    doc_reject_questionnaire: 'Zamítnuto po dotazníku',
    doc_reject_pressure: 'Nízký/Vysoký tlak',
    doc_reject_blood: 'Špatné výsledky krve',

    // Patient Detail Modal inline labels
    doc_modal_phone: 'Telefon',
    doc_modal_arrival: 'Příjezd',
    doc_modal_questionnaire: 'Dotazník',
    doc_modal_questionnaire_answers: 'Odpovědi v dotazníku',
    doc_modal_pressure: 'Tlak',
    doc_modal_sample: 'Vzorek',
    doc_modal_room: 'Místnost',
    doc_modal_volume: 'Objem',

    // Notifications
    notif_new_donor: 'Nový dárce zaregistrován: {name}',
    notif_test_mode: 'Testovací režim zahájen!',
    notif_qr_scanned: 'QR kód naskenován. Čeká se na ověření totožnosti.',
    notif_queue_number: '{name} obdržel číslo',
    notif_questionnaire_done: 'Dotazník vyplněn (Číslo #{number})',
    notif_docs_accepted: 'Doklady přijaty',
    notif_pressure_ok: 'Tlak v normě, přechod k analýze',
    notif_rejected: 'Odmítnutí: {reason}',
    notif_sample_taken: 'Vzorek odebrán, čeká se na výsledky',
    notif_results_ready: 'Výsledky analýzy jsou hotové',
    notif_approved: 'Schválen. Směřován do {room}',
    notif_donation_done: 'Odběr krve dokončen!',
    
    // Waiting Room Board
    board_title: 'Vyvolávací systém',
    board_subtitle: 'Sledujte prosím tabuli. Jakmile se objeví vaše číslo, dostavte se do příslušné místnosti.',
    watch_board: 'Sledujte prosím vyvolávací tabuli v čekárně.',
    watch_board_documents: 'Váš dotazník byl schválen. Předložte prosím své doklady na recepci.',
    board_col_reception: 'Registrace / Doklady',
    board_col_doctor: 'Lékařská prohlídka',
    board_col_donation: 'Odběrový sál',
    board_ticker_title: 'DŮLEŽITÉ:',
    board_ticker_msg_1: 'Darováním krve zachráníte až 3 lidské životy. Děkujeme, že pomáháte!',
    board_ticker_msg_2: 'Po odběru doporučujeme odpočívat 15 minut v čekárně a vypít dostatek tekutin.',
    board_ticker_msg_3: 'V případě nevolnosti ihned informujte přítomný personál.',

    // Vitals Labels
    vitals_title: 'Vstupní vyšetření dárce',
    vitals_bp: 'Krevní tlak',
    vitals_pulse: 'Tepová frekvence',
    vitals_temp: 'Tělesná teplota',
    vitals_hemoglobin: 'Hladina hemoglobinu',
    vitals_sys: 'Systolický',
    vitals_dia: 'Diastolický',
    vitals_unit_bp: 'mmHg',
    vitals_unit_pulse: 'tepů/min',
    vitals_unit_temp: '°C',
    vitals_unit_hemo: 'g/l',
    vitals_btn_measure: 'Změřit hodnoty',
    vitals_btn_approve: 'Schválit vyšetření',
    vitals_placeholder_enter: 'Zadejte',

    // Vitals Clinical Alerts
    vitals_alert_high_bp: 'Vysoký krevní tlak dárce (>180/100 mmHg)',
    vitals_alert_low_bp: 'Nízký krevní tlak dárce (<90/50 mmHg)',
    vitals_alert_pulse: 'Tep mimo bezpečný rozsah (50-100/min)',
    vitals_alert_temp: 'Zvýšená tělesná teplota (>37.5°C)',
    vitals_alert_hemo: 'Nízký hemoglobin (možná anémie) - odklad doporučen!',
    vitals_alert_hemo_gender: 'Hladina hemoglobinu pod limitem pro pohlaví dárce',

    status_labels: {
      'registered': 'Registrován',
      'checked-in': 'Ve frontě',
      'questionnaire': 'Dotazník',
      'documents': 'Doklady',
      'pressure': 'Tlak',
      'blood-sample': 'Vzorek',
      'awaiting-results': 'Čeká na výsledky',
      'doctor-review': 'Prohlídka',
      'donating': 'Odběr',
      'completed': 'Hotovo',
      'rejected': 'Odklad'
    }
  },
  uk: {
    // Login & Register
    login_title: 'Кров Заради Життя',
    login_subtitle: 'Врятуйте життя сьогодні',
    phone_placeholder: '+380 50 123 45 67',
    password_placeholder: 'Пароль',
    login_btn: 'Увійти',
    no_account: 'Немає акаунту? Зареєструйтесь',
    register_title: 'Реєстрація',
    step_personal: 'Особисті дані',
    step_contacts: 'Контакти',
    step_medical: 'Медичні',
    surname: 'Прізвище',
    name: "Ім'я",
    middlename: 'По батькові (необов\'язково)',
    dob: 'Дата народження',
    gender: 'Стать',
    male: 'Чоловіча',
    female: 'Жіноча',
    email: 'Email',
    passport: 'Номер паспорта',
    address: 'Адреса',
    password_create: 'Створіть пароль',
    blood_group: 'Група крові',
    weight: 'Вага (кг)',
    chronic_diseases: 'Хронічні захворювання',
    allergies: 'Алергії',
    medications: 'Ліки, що приймаєте',
    none_placeholder: 'Немає',
    btn_back: 'Назад',
    btn_next: 'Далі',
    btn_create_account: 'Створити акаунт',
    have_account: 'Вже є акаунт? Увійдіть',
    login_error: 'Помилка входу',
    test_mode: 'Тестовий режим',

    // App Navigation
    nav_home: 'Головна',
    nav_history: 'Історія',
    nav_profile: 'Профіль',

    // Home & Gamification
    greeting: 'Добрий день,',
    donor_path: 'Шлях донора',
    donations_count: 'Кількість донацій',
    next_donation_ready: 'Ви можете здати кров сьогодні!',
    next_donation_date: 'Наступна донація можлива з:',
    btn_check_in: 'Я прийшов — Відмітитися',
    
    milestone_1: 'Перший крок',
    milestone_5: 'Бронзовий донор',
    milestone_10: 'Срібний донор',
    milestone_20: 'Золотий донор',
    current_level: 'Поточний рівень',
    donations_left: 'Залишилось донацій: {count}',

    // QR Code
    qr_show_hint: 'Покажіть цей QR-код на стійці реєстрації',
    qr_your_id: 'Ваш ідентифікатор',

    // Profile
    profile_phone: 'Телефон',
    profile_logout: 'Вийти',

    // Status Screen
    status_queue_title: 'Ваш номерок:',
    status_queue_desc: 'Будь ласка, заповніть анкету здоров\'я.',
    btn_fill_questionnaire: 'Заповнити анкету',
    
    status_questionnaire_title: 'Анкету заповнено',
    status_questionnaire_desc: 'Будь ласка, здайте документи на рецепції.',
    
    status_prep_title: 'Проходження огляду',
    status_prep_desc: 'Дотримуйтесь вказівок персоналу.',
    
    status_awaiting_title: 'Очікування результатів',
    status_awaiting_desc: 'Ваш аналіз крові обробляється. Будь ласка, зачекайте.',
    
    status_donating_title: 'Йде здача крові',
    status_donating_desc: 'Відпочивайте. Лікар поруч.',
    
    status_completed_title: 'Дякуємо!',
    status_completed_desc: 'Ваша донація завершена. Ви герой! ❤️',
    
    status_rejected_title: 'Медичний відвід',
    status_rejected_desc: 'На жаль, сьогодні здача крові неможлива.',
    status_rejection_reason: 'Причина:',
    btn_understand: 'Зрозуміло',

    // Questionnaire
    q_title: 'Анкета здоров\'я',
    q_q1: 'Чи добре ви себе почуваєте сьогодні?',
    q_q2: 'Чи була у вас температура за останні 2 тижні?',
    q_q3: 'Чи приймали ви знеболювальні останні 3 дні?',
    q_q4: 'Чи були ви за межами Європи протягом останніх 6 місяців?',
    q_q5: 'Чи хворіли ви коли-небудь на інфекційний гепатит, сифіліс або ВІЛ?',
    q_q6: 'Чи робили ви татуювання або пірсинг протягом останніх 6 місяців?',
    q_yes: 'Так',
    q_no: 'Ні',
    btn_submit_q: 'Відправити анкету',

    // Donor Path Modal
    path_start: 'Старт',
    path_start_desc: 'Ваш шлях починається',
    path_desc_1: 'Перша здача крові',
    path_desc_5: 'Бронзова медаль героя',
    path_desc_10: 'Срібна медаль героя',
    path_desc_20: 'Золота медаль героя',
    path_milestone_50: 'Діамантовий донор',
    path_desc_50: 'Найвища нагорода за порятунок життів',
    path_donation_singular: 'донація',
    path_donation_plural: 'донацій',
    path_reached: 'Досягнуто',
    path_remaining: 'Залишилось:',

    // Landing Page (not used for patient, but kept for completeness)
    landing_title: 'Кров Заради Життя',
    landing_subtitle: 'Оберіть свою роль у системі',
    landing_donor: 'Донор',
    landing_donor_desc: 'Мобільний додаток для пацієнтів: бронювання, анкета, шлях донора.',
    landing_reception: 'Рецепція',
    landing_reception_desc: 'Перевірка документів, реєстрація пацієнтів.',
    landing_doctor: 'Лікар',
    landing_doctor_desc: 'Черга на огляд, схвалення та відстеження здач крові.',

    // Scanner (hardware simulator)
    scanner_title: 'Сканер рецепції',
    scanner_desc: 'Симуляція фізичного прикладання телефону до терміналу клініки.',
    scanner_btn: 'СИМУЛЮВАТИ',
    scanner_success_title: 'Успішний скан!',
    scanner_success_desc: 'Пацієнт з\'явився на рецепції. Тепер адміністратор повинен перевірити документ.',

    // Reception Dashboard
    reception_title: 'Рецепція',
    reception_waiting: 'Очікують реєстрації',
    reception_panel_title: 'Панель рецепції',
    reception_panel_desc: 'Перевірка документів та реєстрація донорів',
    reception_search_placeholder: 'Шукати за прізвищем або ID...',
    reception_search_results: 'Результати пошуку',
    reception_not_found: 'Нічого не знайдено',
    reception_pending: 'Очікують обробки',
    reception_all_done: 'Усі пацієнти оброблені',
    reception_id_doc: 'Документ:',
    reception_blood_group: 'Група крові:',
    reception_verify: 'Перевірити (Check-in)',
    reception_done: 'Оброблено',

    // Doctor Dashboard
    doc_sidebar_queue: 'Черга',
    doc_sidebar_active: 'Активні',
    doc_sidebar_completed: 'Завершені',
    doc_sidebar_search: 'Пошук',
    doc_sidebar_reset: 'Скинути дані',

    doc_stats_queue: 'В черзі',
    doc_stats_active: 'Активні здачі',
    doc_stats_rejected: 'Відхилено',
    doc_stats_completed: 'Завершено',
    doc_stats_volume: 'Об\'єм крові',

    doc_queue_empty: 'Черга порожня',
    doc_active_empty: 'Немає активних донацій',
    doc_completed_empty: 'Поки що немає завершених',

    doc_btn_docs_ok: 'Документи прийнято',
    doc_btn_start_pressure: 'Почати замір тиску',
    doc_btn_sample_taken: 'Зразок взято',
    doc_btn_results_ok: 'Результати готові',
    doc_btn_reject: 'Відмова',
    doc_btn_approve: 'Допустити',
    doc_btn_finish_donation: 'Завершити здачу',

    doc_modal_title_pers: 'Персональні дані',
    doc_modal_title_med: 'Медична інформація',
    doc_modal_title_visit: 'Поточний візит',
    doc_modal_title_hist: 'Історія донацій',
    doc_modal_no_records: 'Немає записів',
    doc_modal_notes: 'Замітки лікаря...',
    doc_btn_save: 'Зберегти',

    // Doctor search
    doc_search_placeholder: 'Шукати за ім\'ям, телефоном, групою крові...',
    doc_search_empty: 'Введіть запит для пошуку донорів',
    doc_search_no_results: 'Нічого не знайдено за запитом «{query}»',
    doc_search_results: 'Результати',
    doc_search_donations: 'Донацій',

    // Doctor queue inline texts
    doc_click_answers: '(Натисніть для перегляду відповідей)',
    doc_reject_questionnaire: 'Відхилено після анкети',
    doc_reject_pressure: 'Низький/Високий тиск',
    doc_reject_blood: 'Погані результати крові',

    // Patient Detail Modal inline labels
    doc_modal_phone: 'Телефон',
    doc_modal_arrival: 'Прибуття',
    doc_modal_questionnaire: 'Анкета',
    doc_modal_questionnaire_answers: 'Відповіді в анкеті',
    doc_modal_pressure: 'Тиск',
    doc_modal_sample: 'Зразок',
    doc_modal_room: 'Кімната',
    doc_modal_volume: 'Об\'єм',

    // Notifications
    notif_new_donor: 'Новий донор зареєстрований: {name}',
    notif_test_mode: 'Тестовий режим розпочато!',
    notif_qr_scanned: 'QR-код відскановано. Очікується перевірка особи.',
    notif_queue_number: '{name} отримав номерок',
    notif_questionnaire_done: 'Анкету заповнено (Номерок #{number})',
    notif_docs_accepted: 'Документи прийнято',
    notif_pressure_ok: 'Тиск в нормі, перехід до аналізу',
    notif_rejected: 'Відмова: {reason}',
    notif_sample_taken: 'Зразок взято, очікування результатів',
    notif_results_ready: 'Результати аналізу готові',
    notif_approved: 'Допущено. Направлено до {room}',
    notif_donation_done: 'Здачу крові завершено!',
    
    // Waiting Room Board
    board_title: 'Система виклику',
    board_subtitle: 'Будь ласка, стежте за табло. Коли з\'явиться ваш номер, пройдіть до відповідного кабінету.',
    watch_board: 'Стежте, будь ласка, за табло в залі очікування.',
    watch_board_documents: 'Вашу анкету схвалено. Будь ласка, пред\'явіть свої документи на рецепції.',
    board_col_reception: 'Реєстрація / Документи',
    board_col_doctor: 'Огляд лікаря',
    board_col_donation: 'Зал донації',
    board_ticker_title: 'ВАЖЛИВО:',
    board_ticker_msg_1: 'Здаючи кров, ви рятуєте до 3 людських життів. Дякуємо за допомогу!',
    board_ticker_msg_2: 'Після донації рекомендуємо відпочити 15 хвилин у приймальні та випити достатньо рідини.',
    board_ticker_msg_3: 'У разі слабкості негайно повідомте персонал.',

    // Vitals Labels
    vitals_title: 'Первинне обстеження донора',
    vitals_bp: 'Артеріальний тиск',
    vitals_pulse: 'Частота пульсу',
    vitals_temp: 'Температура тіла',
    vitals_hemoglobin: 'Рівень гемоглобіну',
    vitals_sys: 'Систолічний',
    vitals_dia: 'Діастолічний',
    vitals_unit_bp: 'мм рт. ст.',
    vitals_unit_pulse: 'уд/хв',
    vitals_unit_temp: '°C',
    vitals_unit_hemo: 'г/л',
    vitals_btn_measure: 'Виміряти показники',
    vitals_btn_approve: 'Затвердити обстеження',
    vitals_placeholder_enter: 'Введіть',

    // Vitals Clinical Alerts
    vitals_alert_high_bp: 'Високий артеріальний тиск (>180/100 мм рт. ст.)',
    vitals_alert_low_bp: 'Низький артеріальний тиск (<90/50 мм рт. ст.)',
    vitals_alert_pulse: 'Пульс поза межами норми (50-100 уд/хв)',
    vitals_alert_temp: 'Підвищена температура тіла (>37.5°C)',
    vitals_alert_hemo: 'Низький гемоглобін (можлива анемія) - рекомендовано відкласти!',
    vitals_alert_hemo_gender: 'Рівень гемоглобіну нижче ліміту для статі донора',

    status_labels: {
      'registered': 'Зареєстрований',
      'checked-in': 'В черзі',
      'questionnaire': 'Анкета',
      'documents': 'Документи',
      'pressure': 'Тиск',
      'blood-sample': 'Зразок',
      'awaiting-results': 'Очікує результати',
      'doctor-review': 'Огляд',
      'donating': 'Здача',
      'completed': 'Завершено',
      'rejected': 'Відмова'
    }
  }
};
