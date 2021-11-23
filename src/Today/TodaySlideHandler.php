<?php

namespace DynamicScreen\Today\Today;

use Carbon\Carbon;
use DynamicScreen\SdkPhp\Handlers\SlideHandler;
use DynamicScreen\SdkPhp\Interfaces\ISlide;

class TodaySlideHandler extends SlideHandler
{

    public function fetch(ISlide $slide): void
    {
        $expiration = Carbon::now()->endOfDay();
        $cache_uuid = base64_encode(json_encode($slide->getOption('category')));
        $cache_key = $this->getIdentifier() ."_{$cache_uuid}";
        $unsplashDriver = $this->getAuthProvider($slide->getAccounts());

        if ($unsplashDriver == null) {
            return ;
        }

        $api_response = app('cache')->remember($cache_key, $expiration, function () use ($unsplashDriver, $slide) {
            return $unsplashDriver->getRandomPhoto($slide->getOption('category'));
        });

        $this->addSlide([
            'saint' => $slide->getOption('saint', false),
            'random_photo' => $api_response['url'],
            'author' => $api_response['photographer'],
        ]);
    }

    public function needed_accounts()
    {
        return $this->module->getOption('privileges.needs_account', false);
    }
}
