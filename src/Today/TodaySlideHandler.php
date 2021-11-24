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
        $driver = $this->getAuthProvider($slide->getAccounts());

        if ($driver == null) {
            return ;
        }

        $cache_key = $driver->getProviderIdentifier() ."_{$cache_uuid}";
        $api_response = app('cache')->remember($cache_key, $expiration, function () use ($driver, $slide) {
            return $driver->getRandomPhoto($slide->getOption('category'));
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
