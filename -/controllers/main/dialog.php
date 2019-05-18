<?php namespace std\ui\dialogs\controllers\main;

class Dialog extends \Controller
{
    private $fullName;

    public function __create()
    {
        $this->fullName = $this->data['name'] . '__' . str_replace('/', '_', $this->data['container']);
    }

    public function reload()
    {
        $this->removeFromPage();
        $this->addToPage();
    }

    public function view()
    {
        $v = $this->v('|' . $this->fullName);

        $widgetData = [
            '.w'       => [
                'dispatcher' => $this->_w('@dispatcher:')
            ],
            '.r'       => [
                'update'       => $this->_p('~xhr:update|' . $this->data['container']),
                'updateSize'   => $this->_p('~xhr:updateSize|' . $this->data['container']),
                'updateOffset' => $this->_p('~xhr:updateOffset|' . $this->data['container']),
                'close'        => $this->_p('~xhr:close|' . $this->data['container']),
                'focus'        => $this->_p('~xhr:focus|' . $this->data['container']),
                'minimize'     => $this->_p('~xhr:minimize|' . $this->data['container']),
                'resetSize'    => $this->_p('~xhr:resetSize|' . $this->data['container'])
            ],
            'fullName' => $this->fullName
        ];

        remap($widgetData, $this->data, '
            container,
            name,
            pluginOptions,
            hidden,
            state,
            offset,
            offset_normal,
            autofit,
            minimized,
            class
        ');

        $this->widget(':|' . $this->fullName, $widgetData);

        $titleView = $this->data('pluginOptions/title') or
        $titleView = "&#160;";

        if ($title = $this->data('title')) {
            if (is_string($title)) {
                $titleView = $title;
            }

            if (is_array($title)) {
                $callOutput = $this->_call($title)->perform();

                if ($callOutput instanceof \ewma\Views\View) {
                    $callOutput = $callOutput->render();
                }

                $titleView = $callOutput;
            }
        }

        $v->assign([
                       'TOUCH'     => $this->data['touch'] * 10000,
                       'NAME'      => $this->data['name'],
                       'FULL_NAME' => $this->fullName,
                       'CONTENT'   => $this->c($this->data['path'], $this->data['data']),
                       'TITLE'     => $titleView
                   ]);

        return $v;
    }

    public function addToPage()
    {
        $this->jquery('~container:|' . $this->data['container'])->append($this->view());

        $this->c('~dispatcher:arrange');
    }

    public function removeFromPage()
    {
        $this->widget(':|' . $this->fullName, 'remove');
    }

    public function contentData($path = false, $value = null)
    {
        if (null !== $value) {
            ap($this->data, path('data', $path), $value);

            return $this;
        } else {
            return ap($this->data, path('data', $path));
        }
    }
}
