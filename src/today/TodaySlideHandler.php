<?php

namespace Vendor\MyApp;


use DynamicScreen\SdkPhp\Handlers\SlideHandler;
use DynamicScreen\SdkPhp\Interfaces\ISlide;

class TodaySlideHandler extends SlideHandler
{
    public function getName(): string
    {
        return 'toto';
    }

    public function fetch(ISlide $slide): array
    {
        return [];
    }

    public function getDefaultOptions(): array
    {
        return [];
    }

    public function hasDuration(): bool
    {
        return true;
    }


}
