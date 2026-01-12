import { useState } from "react";
import { redirect } from "react-router";
import { getUser } from "~/lib/models/auth.server";
import { getUserById, updateUser } from "~/lib/models/user.server";
import { Form, useLoaderData } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";


export async function loader({ request }: { request: Request }) {
  const user = await getUser(request);
  if (!user) throw redirect("/login");

  const userRecord = await getUserById(user.id);
  if (!userRecord) throw new Response("User not found", { status: 404 });

  return { user: userRecord };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const nickname = formData.get("nickname") as string;
  const email = formData.get("email") as string;
  const location = formData.get("prefecture") as string;

  const user = await getUser(request);
  if (!user) throw redirect("/login");

  await updateUser({
    id: user.id,
    name: nickname,
    email,
    location,
  });
  return redirect("/settings");
}

export default function ReUserSettingsPage() {
  const { user } = useLoaderData<typeof loader>();
  const [nickname, setNickname] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [prefecture, setPrefecture] = useState(user.location || "");
  

  return (
    <Form
      method="post"
      className="font-sans flex flex-col items-center min-h-screen p-8 sm:p-20 gap-6
                    bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white"
    >
      <Link 
    to="/home" className="absolute top-4 left-4 sm:top-8 sm:left-8">
       <FontAwesomeIcon icon={faAngleDoubleLeft} path="/home" className="text-[40px] text-white-500"/>
      </Link>
      {/* ヘッダー */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 relative">
          {/*
          <Image
            src="/rounded_image 1.png"
            alt="App Icon"
            fill
            style={{ objectFit: 'contain' }}
          />
          */}
        </div>
        <h1 className="text-3xl font-bold">ユーザー設定変更</h1>
      </div>

      <div className="flex flex-col w-full max-w-md bg-black/30 p-4 rounded-lg gap-4">
        <div className="flex justify-center items-center gap-2">
          <span className="text-gray-300 text-sm">ユーザーID</span>
          <p className="text-lg font-semibold text-center flex-1">{user.id}</p>
        </div>

        <div className="flex justify-center gap-6 mt-2">
          <div className="flex items-center gap-1 cursor-not-allowed">
            <div className="w-4 h-4 rounded-full border-2 bg-gray-600"></div>
            <span className="text-gray-300 text-sm">ユーザー</span>
          </div>
          <div className="flex items-center gap-1 cursor-not-allowed">
            <div className="w-4 h-4 rounded-full border-2 bg-sky-400"></div>
            <span className="text-gray-300 text-sm">自治体</span>
          </div>
        </div>
      </div>

      {/* ニックネーム */}
      <div className="flex flex-col w-full max-w-md bg-black/30 p-4 rounded-lg gap-2">
        <label className="text-gray-300 text-sm">ニックネーム</label>
        <input
          type="text"
          name="nickname"
          value={nickname ?? ""}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="例: TaroToyou"
          className="px-4 py-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* メールアドレス */}
      <div className="flex flex-col w-full max-w-md bg-black/30 p-4 rounded-lg gap-2">
        <label className="text-gray-300 text-sm">メールアドレス</label>
        <input
          type="email"
          name="email"
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="例: example@gmail.com"
          className="px-4 py-3 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 居住地 */}
      <div className="flex flex-col w-full max-w-md bg-black/30 p-4 rounded-lg gap-2">
        <label className="text-gray-300 text-sm">居住地</label>
        <select
          name="prefecture"
          value={prefecture ?? ""}
          onChange={(e) => setPrefecture(e.target.value)}
          className="px-4 py-3 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">居住地を選択</option>
          <option value="北海道">北海道</option>
          <option value="青森県">青森県</option>
          <option value="岩手県">岩手県</option>
          <option value="宮城県">宮城県</option>
          <option value="秋田県">秋田県</option>
          <option value="山形県">山形県</option>
          <option value="福島県">福島県</option>
          <option value="茨城県">茨城県</option>
          <option value="栃木県">栃木県</option>
          <option value="群馬県">群馬県</option>
          <option value="埼玉県">埼玉県</option>
          <option value="千葉県">千葉県</option>
          <option value="東京都">東京都</option>
          <option value="神奈川県">神奈川県</option>
          <option value="新潟県">新潟県</option>
          <option value="富山県">富山県</option>
          <option value="石川県">石川県</option>
          <option value="福井県">福井県</option>
          <option value="山梨県">山梨県</option>
          <option value="長野県">長野県</option>
          <option value="岐阜県">岐阜県</option>
          <option value="静岡県">静岡県</option>
          <option value="愛知県">愛知県</option>
          <option value="三重県">三重県</option>
          <option value="滋賀県">滋賀県</option>
          <option value="京都府">京都府</option>
          <option value="大阪府">大阪府</option>
          <option value="兵庫県">兵庫県</option>
          <option value="奈良県">奈良県</option>
          <option value="和歌山県">和歌山県</option>
          <option value="鳥取県">鳥取県</option>
          <option value="島根県">島根県</option>
          <option value="岡山県">岡山県</option>
          <option value="広島県">広島県</option>
          <option value="山口県">山口県</option>
          <option value="徳島県">徳島県</option>
          <option value="香川県">香川県</option>
          <option value="愛媛県">愛媛県</option>
          <option value="高知県">高知県</option>
          <option value="福岡県">福岡県</option>
          <option value="佐賀県">佐賀県</option>
          <option value="長崎県">長崎県</option>
          <option value="熊本県">熊本県</option>
          <option value="大分県">大分県</option>
          <option value="宮崎県">宮崎県</option>
          <option value="鹿児島県">鹿児島県</option>
          <option value="沖縄県">沖縄県</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-6 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600"
      >
        設定を保存
      </button>
    </Form>
  );
}
