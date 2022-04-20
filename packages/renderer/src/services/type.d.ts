/**
 * 偏好返回
 * example :
 *      "themeName": "夜晚模式",
        "id": 1,
        "userId": 10,
        "nickname": "lulu",
        "avatarUrl": null,
        "theme": "1",
 */
export type PreferenceRes = {
  themeName: string;
  id: number;
  userId: number;
  nickname: string;
  avatarUrl: string | null;
  theme: string;
};
