# JmeterHomework IBS

## Notes

Датапулы находятся в data/

Скриншоты графиков есть в results/Графики, так же есть Report

TestPlan
 - loginToSC закоментирован, потому-что, по заданию он не используется в тесте;
 - loginToSC -> Equals Country properties хитро вызываю эксепшен :)
 - loginToSC -> Clean Cookies нужен чтобы нормально отправить SOAP запрос;
 - sendComment -> Last Comment Assertion тут использовал jsr223 assertion, чтобы исключить случай с нулевым ответом;
 - clearGuestbookHistory правильно ли хранить db connection в этой группе?
 - Чтобы запустилось на другом компе, нужно изменить пути к datapool'ам;

## Charts and Tables

### График "Transactions per Second"
<img width="1175" alt="Transactions per Second" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/4afb88aa-7480-4913-95eb-3b6b71c70396">

Из Jmeter 

<img width="998" alt="Transactions per Second(Jmeter)" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/1db8110c-414f-4629-a660-d14d029187a5">


### График "Response Times Over Time"

<img width="1167" alt="Response Times Over Time" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/c587124a-bf3c-4e02-9d51-4b378ec31697">

Из Jmeter 

<img width="993" alt="Response Times Over Time(Jmeter)" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/d3d017ae-765b-4d8d-92be-9a1b1f42e1df">

### График "PerfMon"
<img width="993" alt="PerfMon" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/da11d39a-6526-48ea-9237-1c8c9fdf0837">

### Таблица "Aggregate Report"
<img width="1024" alt="Aggregate Report" src="https://github.com/zabulonov/JmeterHomework/assets/83907630/fe91e580-2664-455d-9a86-d9bcc3e27675">

### Report Dashboard
Смотри в /results/Report/index.html

### Нюансы

в result.jtl писались не только ошибки;


Иногда при отправке комментария возвращет 500 код, полагаю это ошибка из за того, что некоторые клиеты имеют длинну > 30, а в бд ограничение на это поле(VARCHAR(30))

