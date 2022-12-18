import { createApp, getCurrentInstance, onMounted, ref, h } from "vue";
import { Modal, ConfigProvider } from "ant-design-vue";
import { getAntLocale } from "@/locales";
import { useAppStore } from "@/store/modules/app";

export default (app) => {
  function dialog(
    component: any,
    componentProps: { model: any },
    modalProps: { model?: any }
  ) {
    modalProps = modalProps || {};

    let dialogDiv = document.querySelector("body>div[type=dialog]");
    if (!dialogDiv) {
      dialogDiv = document.createElement("div");
      dialogDiv.setAttribute("type", "dialog");
      document.body.appendChild(dialogDiv);
    }

    const handle = function (checkFunction, afterHandel) {
      if (checkFunction instanceof Function) {
        const res = checkFunction();
        if (res instanceof Promise) {
          res.then((c) => {
            c && afterHandel();
          });
        } else {
          res && afterHandel();
        }
      } else {
        // checkFunction && afterHandel()
        checkFunction || afterHandel();
      }
    };

    const dialogInstance = createApp({
      name: "Dialog",
      components: {
        component,
      },
      setup(props, { emit }) {
        const instance = getCurrentInstance();
        const proxy = instance?.proxy;

        const appStore = useAppStore();
        const _component = ref<typeof component | null>(null);
        const visible = ref<boolean>(true);
        const antLocale = getAntLocale(appStore.lang);

        onMounted(() => {
          _component.value = proxy?.$refs._component;
        });
        const handleClose = function () {
          // @ts-ignore
          handle(_component.value.onCancel, () => {
            visible.value = false;
            emit("close");
            emit("cancel");
            dialogInstance.$.appContext.app.unmount;
          });
        };
        const handleOk = function () {
          handle(
            // @ts-ignore
            _component.value.onOK || _component.value.onOk,
            () => {
              visible.value = false;
              emit("close");
              emit("ok");
              dialogInstance.$.appContext.app.unmount;
            }
          );
        };

        const render = function () {
          const modalModel = modalProps && modalProps.model;

          if (modalModel) {
            delete modalProps.model;
          }
          const ModalProps = {
            visible: visible.value,
            ...modalProps,
            onOk: () => {
              handleOk();
            },
            onCancel: () => {
              handleClose();
            },
          };
          const componentModel = componentProps && componentProps.model;
          if (componentModel) {
            delete componentProps.model;
          }

          const ComponentProps = {
            ref: "_component",
            ...((componentModel && { model: componentModel }) || {}),
            ...componentProps,
          };

          return h("div", null, [
            h(ConfigProvider, { locale: antLocale }, [
              h(Modal, ModalProps, [h(component, ComponentProps)]),
            ]),
          ]);
        };

        return () => render();
      },
    }).mount(dialogDiv);
  }

  app.config.globalProperties.$dialog = dialog;
};
