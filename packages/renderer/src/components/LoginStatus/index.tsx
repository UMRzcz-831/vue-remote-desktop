import { defineComponent, onMounted, ref } from 'vue';
import './index.scss';
import { getUserPreference } from '../../services';
import { PreferenceRes } from '../../services/type';

const LoginStatus = defineComponent({
  setup() {
    const preference = ref<Partial<PreferenceRes>>({});

    onMounted(() => {
      reqUserInfo();
    });

    const reqUserInfo = async () => {
      try {
        const { data, success, msg } = await getUserPreference();
        if (success) {
          preference.value = data;
          console.log(preference.value);
        }
      } catch (error) {
        console.log(error);
      }
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
              <span class="login-status-nickname">{preference.value.nickname || '尚未登录'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default LoginStatus;
