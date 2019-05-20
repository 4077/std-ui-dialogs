<?php namespace std\ui\dialogs\controllers\main;

class Dispatcher extends \Controller
{
    public function add()
    {
        $s = $this->s(false, [
            'tmp_stash' => false
        ]);

        $this->app->html->addContainer($this->_nodeId(), $this->view());

        $this->widget(':', [
            '.r'       => [
                'updateTmpStash' => $this->_p('>xhr:updateTmpStash')
            ],
            'tmpStash' => $s['tmp_stash']
        ]);
    }

    private function view()
    {
        $this->app->html->addCall('dialogsArrange', $this->_abs(':arrange'));

        return $this->v();
    }

    public function arrange()
    {
        $this->widget(':', 'arrange');
    }
}
