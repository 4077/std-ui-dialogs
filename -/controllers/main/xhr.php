<?php namespace std\ui\dialogs\controllers\main;

class Xhr extends \Controller
{
    public $allow = self::XHR;

    public function close()
    {
        $this->c('~container:closeDialog|', $this->data);
    }

    public function focus()
    {
        $this->c('~container:focusDialog|', $this->data);
    }

    public function minimize()
    {
        $name = $this->data('name');

        $dialogs = &$this->s('~container:dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            ra($dialogData, [
                'minimized' => $this->data('minimized')
            ]);
        }
    }

    public function resetSize()
    {
        $name = $this->data('name');

        $dialogs = &$this->s('~container:dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            ra($dialogData, [
                'pluginOptions' => [
                    'width'  => 'auto',
                    'height' => 'auto'
                ]
            ]);

            $this->c('~container:updatePluginOptions:' . $name . '|', [
                'updateData' => [
                    'width'  => 'auto',
                    'height' => 'auto'
                ]
            ]);
        }
    }

    public function update()
    {
        $this->c('~container:updatePluginOptions|', $this->data);
    }
}
