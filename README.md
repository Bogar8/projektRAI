# Razvoj aplikacij za internet
## Pametni paketnik



## API

### /mailbox/api/myMailboxes

body.userId - Uporabnikov ID  
Pridobitev vseh nabiralnikov od uporabnika  
Vrne listo nabrialnikov.

### /packageaccess/api/create
body.username - Uporabniško ime, kateremu dodamo dostop  
body.user_id - Uporabnik, ki dodaja dostop  
body.mailbox_code - Koda nabiralnika kateremu dodamo dostop  
body.date_from - datom od kdaj lahko dostopi do nabiralnika  
body.date_to - datum do kdaj lahko dostopi do nabiralnika  
Vrne true ali false in sporočilo glede na to ali je bil dostop uspešno dodan

### /packageaccess/api/access
body.user_id - ID uporabnika, ki hoče dostopati do nabiralnika  
body.mailbox_code - koda nabiralnika do katerega hočemo dostopati  
Vrne true ali false in sporočilo glede na to ali ima uporabnik dostop

### /users/api/create
body.username - Uporabniško ime
body.password - Geslo
body.email - E-mail  
Vrne true ali false in sporočilo glede na to ali je bila registracija uspešna

###/users/api/login
body.username - Uporabniško ime
body.password - Geslo
Vrne true ali false in sporočilo glede na to ali je bila prijava uspešna

### Razvijalci
Žan Hozjan  
Tilen Heric  
Blaž Bogar  