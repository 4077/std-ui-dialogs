<?php namespace std\ui\dialogs\controllers\main;

class ThemeContainer extends \Controller
{
    public function add()
    {
        $this->app->html->addContainer($this->_nodeInstance());

        $this->css($this->data('css_path') . '|' . $this->_nodeInstance(), [
            '__nodeId__' => $this->app->html->getContainerSelector()
        ]);
    }

    public function getSelector()
    {
        return $this->app->html->getContainerSelector($this->_nodeInstance());
    }
}
