import { defineComponent, onMounted } from 'vue';
import { NPopconfirm } from 'naive-ui';
import { useRouter } from 'vue-router';
import './index.scss';
import { useUserStore } from '../../store';
import { storeToRefs } from 'pinia';
import { isEmpty } from 'lodash';

const LoginStatus = defineComponent({
  setup() {
    const router = useRouter();
    const userSetup = useUserStore();
    const { setPreference, setToken, reqUserInfo } = userSetup;
    const { preference } = storeToRefs(userSetup);

    onMounted(() => {
      console.log(preference.value, 'mounted');
      if (isEmpty(preference.value)) {
        reqUserInfo();
      }
    });

    const handleLogout = () => {
      setToken('');
      setPreference({});
      router.push('/login');
    };

    return () => (
      <div class="login-status-wrapper">
        <div class="login-status-content">
          <div class="login-status-avatar">
            <img
              src={
                preference.value.avatarUrl ||
                'https://avatars0.githubusercontent.com/u/9183485?s=200&v=4'
              }
              alt=""
            />
          </div>
          <div class="login-status-info">
            <div class="login-status-name">
              <span class="login-status-nickname">
                {preference.value.nickname || '尚未登录'}
              </span>
            </div>
            <div
              class="login-status-logout"
              style={{
                visibility: isEmpty(preference.value) ? 'hidden' : 'visible',
              }}
            >
              <NPopconfirm
                placement="right-start"
                onPositiveClick={handleLogout}
                positiveText="确定"
                negativeText="取消"
                v-slots={{
                  trigger: () => (
                    <span class="login-status-logout-text">退出登录</span>
                  ),
                }}
              >
                是否确认退出
              </NPopconfirm>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default LoginStatus;
