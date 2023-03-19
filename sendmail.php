<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'phpmailer/src/Exception.php';
    require 'phpmailer/src/PHPMailer.php';

    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('ru', 'phpmailer/language/');
    $mail->isHTML(true);

    //От кого письмо
    $mail->setFrom('boronina.rina@yandex.ru', 'Я есть Грут-Рина!=)');
    //Кому письмо
    $mail->addAddress('boronina.rina@yandex.ru');
    //Тема письма
    $mail->Subject = 'Привет!Я есть Грут-Рина!=)';

    //Тело письма
    $body = '<h1>Я Ваше письмо!</h1>';

    if (trim(!empty($_POST['name']))) {
        $body.= '<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
    }
    if (trim(!empty($_POST['lastName']))) {
        $body.= '<p><strong>Фамилия:</strong> '.$_POST['lastName'].'</p>';
    }
    if (trim(!empty($_POST['email']))) {
        $body.= '<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
    }
    if (trim(!empty($_POST['phone']))) {
        $body.= '<p><strong>Телефон:</strong> '.$_POST['phone'].'</p>';
    }
    if (trim(!empty($_POST['message']))) {
        $body.= '<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
    }

    //Прикрепить файл 
    if (!empty($_FILES['image']['tmp_name'])) {
        //Путь загрузки файла
        $filePath = __DIR__ . '/files/' . $_FILES['image']['name'];
        //Сама загрузка
        if(copy($_FILES['image']['tmp_name'], $filePath)) {
            $fileAttach = $filePath;
            $body.='<p><strong>Фото в приложении</strong>';
            $mail->addAttachment($fileAttach);
        }
    }

    $mail->Body = $body;

    //Отправка
    if(!$mail->send()) {
        $message = 'Ошибка';
    } else {
        $message = 'Данные отправлены';
    }

    $response = ['message' => $message];

    header('Content-type: application/json');
    echo json_encode($response);
?>
