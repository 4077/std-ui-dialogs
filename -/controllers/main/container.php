<?php namespace std\ui\dialogs\controllers\main;

class Container extends \Controller
{
    public function add()
    {
        $this->app->html->addContainer($this->_nodeInstance(), $this->view());
    }

    public function performCallback($name, $data)
    {
        if ($callback = $data['callbacks'][$name] ?? null) {
            $this->_call($callback)->ra($data)->perform();
        }
    }

    private function view()
    {
        $v = $this->v('|');

        $this->js('ewmaDialog');

        /**
         * @var $cDialog \std\ui\dialogs\controllers\main\Dialog
         */
        foreach ($this->getDialogs() as $cDialog) {
            if (!$cDialog->data['hidden']) {
                if ($cDialog->data['forgot_on_leave']) {
                    $this->forgotDialog($cDialog->data['name']);
                } else {
                    $v->assign('dialog', ['CONTENT' => $cDialog->view()]);
                }
            }
        }

        return $v;
    }

    public function openDialog($name)
    {
        $name = $this->renderName($name);
        $dialogData = $this->renderDialogData($name);

        ra($dialogData, [
            'container' => $this->_instance(),
            'name'      => $name,
            'hidden'    => $this->data['hidden'] ?? false,
            'state'     => 'normal',
            'minimized' => $this->data['minimized'] ?? false, // del
            'touch'     => microtime(true)
        ]);

        $dialogs = &$this->s(':dialogs|');
        $dialogs[$name] = &$dialogData;

        $dialogData['offset'] = $dialogData['offset_normal'];

        $c = $this->getDialogController($dialogData);

        $c->reload();

        $this->performCallback('open', $dialogs[$name]);
    }

    public function closeDialog($name = false)
    {
        $name = $this->renderName($name);

        $dialogs = &$this->s(':dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            if ($dialogData['forgot_on_close'] || $dialogData['forgot_on_leave']) {
                $this->forgotDialog($name);
            } else {
                $dialogData['hidden'] = true;
            }

            $this->getDialogController($dialogData)->removeFromPage();

            $this->performCallback('close', $dialogData);
        }
    }

    public function focusDialog($name = false)
    {
        $name = $this->renderName($name);

        $dialogs = &$this->s(':dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            $this->performCallback('focus', $dialogData);
        }
    }

    public function reloadDialog($name = false)
    {
        $name = $this->renderName($name);

        $dialogs = &$this->s(':dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            $this->getDialogController($dialogData)->reload();
        }
    }

    public function updateDialog($name = false)
    {
        $name = $this->renderName($name);

        $dialogs = &$this->s(':dialogs|');

        if (isset($dialogs[$name])) {
            $dialogData = &$dialogs[$name];

            ra($dialogData, $this->data);

            $this->performCallback('update', $dialogs[$name]);
        }
    }

    public function updatePluginOptions($name = false)
    {
        $dialogs = &$this->s(':dialogs|');

        $name = $this->renderName($name);

        if (isset($dialogs[$name])) {
            ra($dialogs[$name]['pluginOptions'], $this->data('updateData'));

            $dialogs[$name]['touch'] = microtime(true);

            $this->performCallback('update', $dialogs[$name]);

            return $this;
        } else {
            return new \BlackHole;
        }
    }

    public function getDialog($name)
    {
        $name = $this->renderName($name);

        $dialogs = $this->s(':dialogs|');

        if (isset($dialogs[$name])) {
            return $this->getDialogController($dialogs[$name]);
        }
    }

    private function getDialogs()
    {
        $dialogs = $this->s(':dialogs|');

        $output = [];

        foreach ((array)$dialogs as $name => $dialog) {
            while (isset($output[$dialog['touch']])) {
                $dialog['touch'] += 0.0001;
            }

            $output[$dialog['touch']] = $this->getDialogController($dialog);
        }

        ksort($output);

        $output = array_values($output);

        return $output;
    }

    /**
     * @param $data
     *
     * @return \std\ui\dialogs\controllers\main\Dialog
     */
    private function getDialogController($data)
    {
        return $this->c('~dialog', $data);
    }

    private function forgotDialog($name = false)
    {
        $dialogs = &$this->s(':dialogs|');

        $name = $this->renderName($name);

        if (isset($dialogs[$name])) {
            unset($dialogs[$name]);
        }
    }

    private function renderName($name = false)
    {
        if ($name) {
            return $name;
        } else {
            return $this->data('name');
        }
    }

    private function renderDialogData($name = false)
    {
        $defaultData = $this->getDefaultDialogData();

        if (isset($this->data['default'])) {
            ra($defaultData, $this->data['default']);
        }

        if ($name) {
            $dialogs = &$this->s(':dialogs|');

            if (isset($dialogs[$name])) {
                $data = $dialogs[$name];

                aa($data, $defaultData);
            }
        }

        if (empty($data)) {
            $data = $defaultData;
        }

        ra($data, unmap($this->data, 'default, data, theme'));

        $theme = $this->data('theme') or
        $theme = 'default';

        ra($data, [
            'pluginOptions/appendTo' => $this->c('@themeContainer:getSelector|' . $theme)
        ]);

        $data['path'] = $this->_caller()->_caller()->_p($data['path']);
        $data['data'] = $this->data('data');

        return $data;
    }

    private function getDefaultDialogData()
    {
        return [
            'container'       => null,
            'name'            => null,
            'path'            => null,
            'data'            => [],
            'forgot_on_leave' => false,
            'forgot_on_close' => false,
            'hidden'          => false,
            'minimized'       => false, // del
            'state'           => 'normal',
            'offset'          => false,
            'offset_normal'   => false,
            'autofit'         => true,
            'pluginOptions'   => []
        ];
    }
}
