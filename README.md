# Odběr Krve 🩸

Moderní informační systém pro správu a digitalizaci dárcovství krve na klinikách. Tento projekt propojuje klientskou aplikaci dárce s panely pro zdravotnický personál a chytrým vyvolávacím systémem v čekárně.

---

## 📱 Hlavní Moduly Systému

Aplikace je rozdělena do 4 klíčových rozhraní podle uživatelských rolí:

### 1. Rozhraní Dárce (Mobilní aplikace)
*   **Registrace a Přihlášení**: Bezpečný uživatelský profil přes Firebase Authentication.
*   **Profil dárce**: Správa kontaktních a zdravotních údajů (váha, alergie, medikace).
*   **Virtuální QR Průkaz**: Unikátní QR kód pro okamžitý check-in na recepci kliniky.
*   **Zdravotní dotazník**: Vyplnění povinného předběžného dotazníku přímo v telefonu před prohlídkou.
*   **Cesta dárce**: Herní motivace formou milníků a odznaků (Bronzová, Stříbrná, Zlatá a Diamantová medaile).

### 2. Panel Recepce
*   Zpracování příchozích dárců.
*   Ověření totožnosti (pas/OP) a přiřazení pořadového čísla do fronty vyšetření jedním kliknutím.

### 3. Panel Lékaře
*   Přehledná fronta pacientů aktualizovaná v reálném čase.
*   **Upozornění na rizika**: Systém automaticky analyzuje dotazník dárce a zvýrazní rizikové faktory (např. nedávné nemoci, léky).
*   **Záznam vyšetření**: Zadávání vitálních funkcí (tlak, hemoglobin, teplota) a schválení k samotnému odběru.

### 4. Vyvolávací tabule (Čekárna)
*   Velkoplošný přehled aktuálně volaných čísel na jednotlivá pracoviště (recepce, vyšetření, laboratoř, odběrový sál).
*   **Hlasový syntetizátor**: Plně lokalizované české vyvolávání pacientů hlasem.

---

## 🛠️ Technologie

*   **Frontend**: React (Vite)
*   **Styling**: Vanilla CSS s moderními designovými tokeny (`src/theme.js`)
*   **Backend & Databáze**: Firebase (Auth pro přihlašování, Firestore pro real-time synchronizaci dat)
*   **Připraveno pro mobilní export**: Kód klientské aplikace je oddělen pomocí platformových adaptérů (paměť, vibrace, řeč) pro snadný převod do nativní mobilní aplikace (Expo/React Native).

---

## 🚀 Jak aplikaci spustit lokálně

### Požadavky
*   Nainstalovaný [Node.js](https://nodejs.org/)

### Spuštění vývojového serveru
1.  Nainstalujte závislosti:
    ```bash
    npm install
    ```
2.  Spusťte lokální server:
    ```bash
    npm run dev
    ```
3.  Otevřete v prohlížeči adresu: `http://localhost:5173`

### Sestavení pro produkci
Pro vygenerování optimalizovaných souborů pro nasazení (do složky `/dist`):
```bash
npm run build
```
