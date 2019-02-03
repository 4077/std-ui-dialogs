<?php namespace std\ui\dialogs\controllers\main;

class Dispatcher extends \Controller
{
    public function add()
    {
        $this->app->html->addContainer($this->_nodeId(), $this->view());

        $this->widget(':');
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
