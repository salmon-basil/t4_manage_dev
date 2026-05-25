//////////////////////////////////////////////////////////////////
//ユーザーを管理するクラス
//製作中：深谷
//


export class User{
    #id;//管理用id
    #user_name;//ユーザーネーム
    #weekly_total_hour;//その週の勉強時間
    #total_hour;//累計の勉強時間
    #rank;//ランク

    constructor(
        id,
        user_name,
        weekly_total_hour,
        total_hour,
        rank
    )
    {
        this.#id = id;
        this.#user_name = user_name;
        this.#weekly_total_hour = weekly_total_hour;
        this.#total_hour = total_hour;
        this.#rank = rank;
    }

    




}