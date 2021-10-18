<?php

namespace Vendor\MyApp;


use DynamicScreen\SdkPhp\Slide\SlideHandler;
use DynamicScreen\SdkPhp\Slide\ISlide;

class Today extends SlideHandler {

    public function fetch(ISlide $slide): array
    {
        return [];
    }

    public function getDefaultOptions(): array
    {
        return [];
    }
}
