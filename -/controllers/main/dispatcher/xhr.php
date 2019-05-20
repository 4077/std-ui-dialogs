<?php namespace std\ui\dialogs\controllers\main\dispatcher;

class Xhr extends \Controller
{
    public $allow = self::XHR;

    public function updateTmpStash()
    {
        $this->s('<:tmp_stash', $this->data('enabled'), RR);
    }
}
