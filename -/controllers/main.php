<?php namespace std\ui\dialogs\controllers;

class Main extends \Controller
{
    public $singleton = true;

    private $commonAdded;

    private function addCommon()
    {
        if (!$this->commonAdded) {
            $this->c('>dispatcher:add');

            $baseZIndex = dataSets()->get('modules/std-ui-dialogs::base_zindex') or
            $baseZIndex = 10000;

            $this->css(false, [
                'baseZIndex' => $baseZIndex
            ]);

            $this->commonAdded = true;
        }
    }

    private $defaultThemeContainerAdded;

    private function addDefaultThemeContainer()
    {
        if (!$this->defaultThemeContainerAdded) {
            $this->c('>themeContainer:add|default', [
                'css_path' => $this->_p('~defaultTheme')
            ]);

            $this->defaultThemeContainerAdded = true;
        }
    }

    private $addedContainers = [];

    public function addContainer($name)
    {
        if (!isset($this->addedContainers[$name])) {
            $this->addCommon();
            $this->addDefaultThemeContainer();

            $this->c('>container:add|' . $name);

            $this->addedContainers[$name] = true;
        }
    }

    private $addedThemeContainers = [];

    public function addThemeContainer($name, $cssPath)
    {
        if (!isset($this->addedThemeContainers[$name])) {
            $cssPath = $this->_caller()->_p($cssPath);

            $this->c('>themeContainer:add|' . $name, [
                'css_path' => $cssPath
            ]);

            $this->addedThemeContainers[$name] = true;
        }
    }

    public function open($name = false, $theme = null)
    {
        if (null !== $theme) {
            $this->data('theme', $theme);
        }

        $this->c('>container:openDialog:' . $name . '|', $this->data);
    }

    public function close($name = false)
    {
        $this->c('>container:closeDialog:' . $name . '|');
    }

    public function reload($name = false)
    {
        $this->c('>container:reloadDialog:' . $name . '|');
    }

    public function getData($name = false)
    {
        if ($dialog = $this->get($name)) {
            return $dialog->data;
        }
    }

    public function update($name = false)
    {
        $this->c('>container:updateDialog:' . $name . '|', $this->data);
    }

    public function updateAndReload($name = false)
    {
        $this->c('>container:updateDialog:' . $name . '|', $this->data);
        $this->c('>container:reloadDialog:' . $name . '|');
    }

    /**
     * @param bool|false $name
     *
     * @return \std\ui\dialogs\controllers\main\Dialog|null
     */
    public function get($name = false)
    {
        return $this->c('>container:getDialog:' . $name . '|');
    }
}
