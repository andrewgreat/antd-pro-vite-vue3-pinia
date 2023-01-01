import { App } from "vue";

// base library
import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  Card,
  Form,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Badge,
  Popover,
  Dropdown,
  List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  PageHeader,
  Result,
  Statistic,
  Descriptions,
  Space,
} from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";
import Icons from "@/utils/icons";
import { VueAxios } from "@/utils/request";

// ext library
import VueCropper from "vue-cropper";
import "vue-cropper/dist/index.css";
import Dialog from "@/components/Dialog";
import MultiTab from "@/components/MultiTab";
import PageLoading from "@/components/PageLoading";
import Authorize from "@/core/authorize";
// import "./directives/action";

export function lazyApp(app: App<Element>) {
  console.log("main.ts...", "lazy");
  app.use(ConfigProvider);
  app.use(Layout);
  app.use(Input);
  app.use(InputNumber);
  app.use(Button);
  app.use(Switch);
  app.use(Radio);
  app.use(Checkbox);
  app.use(Select);
  app.use(Card);
  app.use(Form);
  app.use(Row);
  app.use(Col);
  app.use(Modal);
  app.use(Table);
  app.use(Tabs);
  app.use(Badge);
  app.use(Popover);
  app.use(Dropdown);
  app.use(List);
  app.use(Avatar);
  app.use(Breadcrumb);
  app.use(Steps);
  app.use(Spin);
  app.use(Menu);
  app.use(Drawer);
  app.use(Tooltip);
  app.use(Alert);
  app.use(Tag);
  app.use(Divider);
  app.use(DatePicker);
  app.use(TimePicker);
  app.use(Upload);
  app.use(Progress);
  app.use(Skeleton);
  app.use(Popconfirm);
  app.use(PageHeader);
  app.use(Result);
  app.use(Statistic);
  app.use(Descriptions);
  app.use(Space);
  app.use(Icons);
  app.use(ProLayout);
  app.use(PageContainer);
  app.component("page-header-wrapper", PageContainer);
  app.use(VueAxios);
  app.use(Dialog); // $dialog func
  app.use(MultiTab);
  app.use(PageLoading);
  app.use(Authorize);
  app.use(VueCropper);

  import.meta.env.VITE_NODE_ENV !== "production" &&
    console.warn("[antd] NOTICE: Antd use lazy-load.");
}
