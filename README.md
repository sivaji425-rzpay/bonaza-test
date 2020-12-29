Steps to run project

1st edit PaymentController.php file in project root directory
bonanza\app\Http\Controllers
& also change RAZOR_KEY in form js to yours

2nd terminal
2) npm run watch

3rd terminal
3) php artisan serve

visit here: http://127.0.0.1:8000/

done

if error in terminal
1)composer dump-autoload
2)php artisan config:cache
3)php artisan cache:clear
