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

    public function updateOffset()
    {
        $name = $this->data('name');

        $dialogs = &$this->s('~container:dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            $updateData = $this->data('update_data');

            remap($dialogData, $updateData, '
                state,
                offset,
                offset_normal,
                autofit
            ');
        }
    }

    public function updateSize()
    {
        $name = $this->data('name');

        $dialogs = &$this->s('~container:dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            $updateData = $this->data('update_data');

            remap($dialogData, $updateData, '
                pluginOptions/width     width,
                pluginOptions/height    height,
                autofit
            ');
        }
    }

    public function resetSize()
    {
        $name = $this->data('name');

        $dialogs = &$this->s('~container:dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            ra($dialogData, [
                'state'         => $this->data('state'),
                'pluginOptions' => [
                    'width'  => 'auto',
                    'height' => 'auto'
                ]
            ]);

            $this->c('~container:updatePluginOptions:' . $name . '|', [
                'state'      => $this->data('state'),
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
