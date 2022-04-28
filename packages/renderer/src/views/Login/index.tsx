import { defineComponent, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import {
  NTabs,
  NCard,
  NTabPane,
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  FormRules,
  FormInst,
  NRadioGroup,
  useMessage,
  NRadio,
} from 'naive-ui';
import './index.scss';
import { LoginParams, RegistParams } from '../../services/type';
import { login, regist } from '../../services';
import { useUserStore } from '../../store';
const Login = defineComponent({
  setup() {
    onMounted(() => {});

    const userSetup = useUserStore();
    const { setToken } = userSetup;

    const msger = useMessage();
    const router = useRouter();

    const currentTab = ref('signin');
    const loginValue = ref<LoginParams>({
      username: '',
      password: '',
      mobile: '',
      type: 0,
    });
    const registValue = ref<RegistParams & { repeatPassword: string }>({
      username: '',
      password: '',
      repeatPassword: '',
      mobile: '',
    });

    const submitLoading = ref(false);
    const rules = ref<FormRules>({
      username: [
        { required: !Boolean(loginValue.value.type), message: '请输入用户名' },
      ],
      password: [{ required: true, message: '请输入密码' }],
      mobile: [
        { required: Boolean(loginValue.value.type), message: '请输入手机号' },
      ],
    });
    const registRules = ref<FormRules>({
      username: [
        { required: true, message: '请输入用户名' },
        {
          type: 'string',
          min: 4,
          message: '用户名长度不小于4',
        },
        {
          type: 'string',
          max: 20,
          message: '用户名长度不大于20',
        },
      ],
      password: [
        { required: true, message: '请输入密码' },
        {
          type: 'string',
          min: 6,
          message: '密码长度不小于6',
        },
        {
          type: 'string',
          max: 32,
          message: '密码长度不大于32',
        },
      ],
      repeatPassword: [
        { required: true, message: '请再次输入密码' },
        {
          validator: (rule, value: string) => {
            return new Promise((resolve, reject) => {
              if (value !== registValue.value.password) {
                reject(new Error('两次密码不一致'));
              } else {
                resolve();
              }
            });
          },
        },
      ],
      mobile: [
        { required: true, message: '请输入手机号' },
        {
          type: 'string',
          pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
          message: '手机号不正确',
        },
      ],
    });
    const signin = ref<FormInst | null>();
    const signup = ref<FormInst | null>();

    const reqLogin = async (params: LoginParams) => {
      try {
        const { data, success, msg } = await login(params);
        submitLoading.value = false;
        if (success) {
          const { token } = data;
          msger.success('登录成功');
          setToken(token);
          router.push('/home');
        } else {
          msger.error(msg);
        }
      } catch (error) {
        throw error;
      }
    };

    const handleLogin = async () => {
      try {
        await signin.value?.validate();
      } catch (error) {
        msger.warning('请完善信息');
        throw error;
      }

      try {
        submitLoading.value = true;
        const { type, password } = loginValue.value;
        const key = type === 0 ? 'username' : 'mobile';
        const value = loginValue.value[key];
        const params = {
          type,
          [key]: value,
          password,
        };
        await reqLogin(params);
      } catch (error) {
        throw error;
      }
    };

    const handleRegist = async () => {
      try {
        await signup.value?.validate();
      } catch (error) {
        msger.warning('请完善信息');
        throw error;
      }
      try {
        const { success, msg } = await regist(registValue.value);
        if (success) {
          msger.success('注册成功,请登录');
          currentTab.value = 'signin';
          registValue.value = {
            username: '',
            password: '',
            repeatPassword: '',
            mobile: '',
          };
        } else {
          msger.error(msg);
        }
      } catch (error) {
        throw error;
      }
    };

    const handleTypeChange = (value: number) => {
      rules.value = {
        username: [
          {
            required: !Boolean(value),
            message: '请输入用户名',
          },
        ],
        password: [{ required: true, message: '请输入密码' }],
        mobile: [
          { required: Boolean(value), message: '请输入手机号' },
          {
            pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/,
            message: '手机号格式错误',
          },
        ],
      };
    };

    const handleTabChange = (value: string) => {
      currentTab.value = value;
      if (value === 'signup') {
        loginValue.value = {
          username: '',
          password: '',
          mobile: '',
          type: 0,
        };
      } else {
        registValue.value = {
          username: '',
          password: '',
          repeatPassword: '',
          mobile: '',
        };
      }
    };

    return {
      handleLogin,
      handleRegist,
      handleTypeChange,
      handleTabChange,
      loginValue,
      registValue,
      signin,
      signup,
      currentTab,
      rules,
      registRules,
      submitLoading,
    };
  },
  render() {
    const {
      loginValue,
      registValue,
      rules,
      registRules,
      submitLoading,
      currentTab,
      handleLogin,
      handleTypeChange,
      handleTabChange,
      handleRegist,
    } = this;
    return (
      <div class="login-wrapper">
        <NCard bordered={false}>
          <NTabs
            class="card-tabs"
            size="large"
            value={currentTab}
            onUpdate:value={handleTabChange}
            animated
            style="margin: 0 auto; max-width: 400px;"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          >
            <NTabPane name="signin" tab="登录">
              <NForm ref="signin" model={loginValue} rules={rules}>
                <NFormItemRow path="type">
                  <NRadioGroup
                    v-model:value={loginValue.type}
                    name="radiogroup"
                    onUpdate:value={handleTypeChange}
                  >
                    <NRadio value={0} key={0}>
                      用户名登录
                    </NRadio>
                    <NRadio value={1} key={1}>
                      手机号登录
                    </NRadio>
                  </NRadioGroup>
                </NFormItemRow>
                {loginValue.type === 0 ? (
                  <NFormItemRow label="用户名" path="username">
                    <NInput
                      v-model:value={loginValue.username}
                      placeholder="请输入用户名"
                    />
                  </NFormItemRow>
                ) : (
                  <NFormItemRow label="手机号" path="mobile">
                    <NInput
                      v-model:value={loginValue.mobile}
                      placeholder="请输入手机号"
                    />
                  </NFormItemRow>
                )}

                <NFormItemRow label="密码" path="password">
                  <NInput
                    type="password"
                    v-model:value={loginValue.password}
                    placeholder="请输入密码"
                  />
                </NFormItemRow>
              </NForm>
              <NButton
                type="primary"
                block
                secondary
                strong
                onClick={handleLogin}
                loading={submitLoading}
              >
                登录
              </NButton>
            </NTabPane>
            <NTabPane name="signup" tab="注册">
              <NForm rules={registRules} model={registValue} ref="signup">
                <NFormItemRow label="用户名" path="username">
                  <NInput
                    placeholder="输入用户名"
                    v-model:value={registValue.username}
                  />
                </NFormItemRow>
                <NFormItemRow label="密码" path="password">
                  <NInput
                    placeholder="输入密码"
                    type="password"
                    v-model:value={registValue.password}
                  />
                </NFormItemRow>
                <NFormItemRow label="重复密码" path="repeatPassword">
                  <NInput
                    placeholder="再次输入密码"
                    type="password"
                    v-model:value={registValue.repeatPassword}
                  />
                </NFormItemRow>
                <NFormItemRow label="手机号" path="mobile">
                  <NInput
                    v-model:value={registValue.mobile}
                    placeholder="请输入手机号"
                  />
                </NFormItemRow>
              </NForm>
              <NButton
                type="primary"
                block
                secondary
                strong
                onClick={handleRegist}
              >
                注册
              </NButton>
            </NTabPane>
          </NTabs>
        </NCard>
      </div>
    );
  },
});

export default Login;
