# Kom igång med mobilappen

## Förbered din smartphone

Ladda ner appen Expo Go. Den finns i App Store, och bör även finnas i Google Play-butiken.

## Skapa .env-filer

För att kommunikationen mellan mobilappen och backend (och databasen) ska fungera behöver man lägga in  sin lokala IPv4-adress. Den hittas enklast genom att man skriver in

`hostname -I`

i terminalen. För mig är det den första adressen som är aktuell.
Skapa en fil med namnet ´.env´ i roten av projektet, dvs samma mapp som den här filen ligger i. I den filen, definiera variablen IP som din lokala IPv4-adress. För mig blir det

`IP=192.168.50.83`

och spara sedan filen.

Gå sedan in i mappen för mobilappen, `mobileapp-customer`, och skapa en likadan fil där, med samma namn och innehåll, i roten av den mappen.

Kör också `npm install`i `mobileapp-customer` för att få alla dependencies.

## Starta mobilappen första gången

För att kunna arbeta med mobilappen verkar det vara enklast att koppla sin mobil till sin localhost med hjälp av appen Expo Go. Så, din mobiltelefon behöver, i den setup som jag har använt, vara på samma lokala nätverk som din dator.

### För att komma igång

Stå i mappen mobileapp-customer, och starta appen med `npm start`. I terminalen bör nu en QR-kod visas, och texten "Metro waiting on exp://XXX.XXX.XX.XX.8081". Skanna koden med din telefon, och då bör appen Expo Go öppnas automatiskt, och React Native-projektet byggs och visas (det tar en liten stund).

Projektet och den lokala adressen sparas i appen under "Recently opened". Det här steget, med QR-koden, är viktigt för att kunna koppla sitt projekt till Expo Go - jag har inte hittat något uppenbart sätt att skriva in en adress manuellt.

Det kan vara värt att notera IP-adressen i meddelandet under QR-koden - det är den som behöver ligga i de båda .env-filerna. Den ska vara samma som den man får via `hostname -I`, men om något krånglar så kan det vara bra att se så att man har skrivit rätt adress.

Sedan kan man stänga ner projektet med CTR+C, och istället köra `docker-compose up --build` i projektroten som vanligt. Det tar en stund att bygga, men när alla services är uppe bör man kunna gå in i Expo Go appen på sin telefon (håll tre fingrar på skärmen för att få upp en meny där man kan välja "Reload") och se projektet. Under fliken "Profil" bör man kunna se data från databasen.
