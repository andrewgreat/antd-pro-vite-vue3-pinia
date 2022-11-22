<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :model="formRef"
      @submit="handleSubmit"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <!-- 账户密码登录 -->
        <a-tab-pane key="tab1" :tab="$t('user.login.tab-login-credentials')">
          <a-alert
            v-if="isLoginError"
            type="error"
            showIcon
            style="margin-bottom: 24px"
            :message="$t('user.login.message-invalid-credentials')"
          />
          <a-form-item v-bind="validateInfos.username">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.username.placeholder')"
              v-model:value="formRef.username"
            >
              <template #prefix>
                <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item v-bind="validateInfos.password">
            <a-input-password
              size="large"
              :placeholder="$t('user.login.password.placeholder')"
              v-model:value="formRef.password"
            >
              <template #prefix>
                <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
              </template>
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
        <!-- 手机号登录 -->
        <a-tab-pane key="tab2" :tab="$t('user.login.tab-login-mobile')">
          <a-form-item v-bind="validateInfos.mobile">
            <a-input
              size="large"
              type="text"
              :placeholder="$t('user.login.mobile.placeholder')"
              v-model:value="formRef.mobile"
            >
              <MobileOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row" :span="16">
              <a-form-item v-bind="validateInfos.captcha">
                <a-input
                  size="large"
                  type="text"
                  :placeholder="
                    $t('user.login.mobile.verification-code.placeholder')
                  "
                  v-model:value="formRef.captcha"
                >
                  <MailOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row" :span="8">
              <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="state.smsSendBtn"
                @click.stop.prevent="getCaptcha"
              >
                {{
                  (!state.smsSendBtn &&
                    $t("user.register.get-verification-code")) ||
                  state.time + " s"
                }}
              </a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>

      <a-form-item v-bind="validateInfos.rememberMe">
        <a-checkbox v-model:checked="formRef.rememberMe" style="float: left">
          {{ $t("user.login.remember-me") }}
        </a-checkbox>
        <router-link
          :to="{ name: 'recover', params: { user: 'aaa' } }"
          class="forge-password"
          style="float: right"
          >{{ $t("user.login.forgot-password") }}</router-link
        >
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
          >{{ $t("user.login.login") }}</a-button
        >
      </a-form-item>

      <div class="user-login-other">
        <span>{{ $t("user.login.sign-in-with") }}</span>
        <a>
          <alipay-circle-outlined />
        </a>
        <a>
          <taobao-outlined />
        </a>
        <a>
          <weibo-square-outlined />
        </a>
        <router-link class="register" :to="{ name: 'register' }">
          {{ $t("user.login.signup") }}
        </router-link>
      </div>
    </a-form>

    <two-step-captcha
      v-if="requiredTwoStepCaptcha"
      :visible="stepCaptchaVisible"
      @success="stepCaptchaSuccess"
      @cancel="stepCaptchaCancel"
    ></two-step-captcha>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, UnwrapRef } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import md5 from "md5";
import { FormState } from "./types";
import TwoStepCaptcha from "@/components/tools/TwoStepCaptcha.vue";
import { useUserStore } from "@/store/modules/user";
import { timeFix } from "@/utils/util";
import { getSmsCaptcha, get2step } from "@/api/login";
import { notification, message } from "ant-design-vue";
import { useForm } from "ant-design-vue/lib/form";

export default defineComponent({
  components: {
    TwoStepCaptcha,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const { t } = useI18n();
    // const Login = (userInfo) => store.dispatch('Login', userInfo)
    const Logout = userStore.Logout;

    onMounted(() => {
      get2step({})
        .then((res) => {
          // @ts-ignore
          requiredTwoStepCaptcha.value = res.result.stepCode;
        })
        .catch(() => {
          requiredTwoStepCaptcha.value = 0;
        });
      requiredTwoStepCaptcha.value = 1;
    });

    const isLoginError = ref(false);

    const state = reactive({
      time: 60,
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      smsSendBtn: false,
    });
    // #region 表单相关

    // handler
    const handleUsernameOrEmail = (rule, value) => {
      const regex =
        /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      if (regex.test(value)) {
        state.loginType = 0;
      } else {
        state.loginType = 1;
      }
      return Promise.resolve("success");
    };

    const formRef: UnwrapRef<FormState> = reactive({
      rememberMe: false,
      username: "",
      password: "",
      mobile: "",
      captcha: "",
    });

    const rulesRef = reactive({
      rememberMe: [{ trigger: "checked" }],
      username: [
        {
          required: true,
          message: t("user.username.required"),
        },
        {
          validator: handleUsernameOrEmail,
          trigger: "change",
        },
      ],
      password: [{ required: true, message: t("user.password.required") }, {}],
      mobile: [
        {
          required: true,
          pattern: /^1[34578]\d{9}$/,
          message: t("user.login.mobile.placeholder"),
          validateTrigger: "change",
        },
      ],
      captcha: [
        {
          required: true,
          message: t("user.verification-code.required"),
          validateTrigger: "blur",
        },
      ],
    });

    const loginSuccess = (res?) => {
      router.push({ path: "/" });
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        const user = res ? `${res.username}` : "";
        notification.success({
          message: `欢迎${user}`,
          description: `${timeFix()}，欢迎回来`,
        });
      }, 1000);
    };

    const requestFailed = (err) => {
      console.log(err);
      notification["error"]({
        message: "错误",
        description:
          (err || err.data || {}).message || "请求出现错误，请稍后再试",
        duration: 4,
      });
    };

    //#region TwoStepCaptcha
    const requiredTwoStepCaptcha = ref<number>(0);
    const stepCaptchaVisible = ref<boolean>(false);
    const stepCaptchaSuccess = () => {
      loginSuccess();
    };
    const stepCaptchaCancel = () => {
      Logout().then(() => {
        state.loginBtn = false;
        stepCaptchaVisible.value = false;
      });
    };

    const { validate, validateInfos } = useForm(formRef, rulesRef);

    //#region 切换tab
    const customActiveKey = ref<string>("tab1");
    const handleTabClick = (key: string) => {
      customActiveKey.value = key;
    };
    //#endregion

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      state.loginBtn = true;
      const validateFieldsKey =
        customActiveKey.value === "tab1"
          ? ["username", "password"]
          : ["mobile", "captcha"];

      validate(validateFieldsKey)
        .then((result) => {
          // console.log(res, toRaw(formRef));
          const loginParams = { ...result };
          // delete loginParams.username
          loginParams[!state.loginType ? "email" : "username"] =
            result.username;
          loginParams.password = md5(result.password);
          userStore
            .Login(loginParams)
            .then((res) => loginSuccess(res))
            .catch((err) => requestFailed(err))
            .finally(() => {
              state.loginBtn = false;
            });
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            state.loginBtn = false;
          }, 600);
        });
    };

    const getCaptcha = (e) => {
      e.preventDefault();
      validate(["mobile"]).then((res) => {
        state.smsSendBtn = true;
        const interval = window.setInterval(() => {
          if (state.time-- <= 0) {
            state.time = 60;
            state.smsSendBtn = false;
            window.clearInterval(interval);
          }
        }, 1000);

        message.loading("验证码发送中..", 1);

        getSmsCaptcha({ mobile: res.mobile })
          .then((res) => {
            notification["success"]({
              message: "提示",
              // @ts-ignore
              description:
                "验证码获取成功，您的验证码为：" + res.result.captcha,
              duration: 8,
            });
          })
          .catch((err) => {
            clearInterval(interval);
            state.time = 60;
            state.smsSendBtn = false;
            requestFailed(err);
          });
      });
    };

    return {
      formRef,
      rulesRef,
      state,
      customActiveKey,
      isLoginError,
      requiredTwoStepCaptcha,
      stepCaptchaVisible,
      handleTabClick,
      handleSubmit,
      validateInfos,
      getCaptcha,
      stepCaptchaSuccess,
      stepCaptchaCancel,
    };
  },
});
</script>

<style lang="less" scoped>
@import "../../style/index.less";

.pro-layout-login-main {
  width: 360px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forget-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .anticon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
