<?php

return [
    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],
    'ses' => [
        'key'    => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel'              => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'docupipe' => [
        'key'               => env('DOCUPIPE_API_KEY'),
        'student_schema_id' => env('DOCUPIPE_STUDENT_SCHEMA_ID'),
        'worker_schema_id'  => env('DOCUPIPE_WORKER_SCHEMA_ID'),
    ],
];
