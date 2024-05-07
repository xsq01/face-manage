declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseFeatureInfo_ = {
    code?: number;
    data?: FeatureInfo;
    message?: string;
  };

  type BaseResponseListDataFc_ = {
    code?: number;
    data?: DataFc[];
    message?: string;
  };

  type BaseResponseListUserFaceVo_ = {
    code?: number;
    data?: UserFaceVo[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserFaceVoL_ = {
    code?: number;
    data?: PageUserFaceVoL_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DataF = {
    data?: string[];
    type?: string;
  };

  type DataFc = {
    date?: string;
    identify?: string;
    people?: number;
    pid?: string;
    userFaceID?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type FeatureInfo = {
    newImageBase64?: string;
    oldImageBase64?: string;
  };

  type getListImageUrlUsingPOSTParams = {
    /** sessionId */
    sessionId: string;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    plantCode?: string;
    updateTime?: string;
    userAvatar?: string;
    userCount?: number;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserFaceVoL_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserFaceVoL[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    plantCode?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    plantCode?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserFaceAddRequest = {
    userName?: string;
    userNum?: string;
  };

  type UserfaceQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userNum?: string;
    userRole?: string;
  };

  type UserFaceRequest = {
    imageBase64?: string[];
    userName?: string;
    userNum?: string;
  };

  type UserFaceVo = {
    pid?: string;
    userName?: string;
    userNum?: string;
  };

  type UserFaceVoL = {
    createTime?: string;
    id?: number;
    pid?: string;
    updateTime?: string;
    userFace?: string;
    userName?: string;
    userNum?: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    plantCode?: string;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    plantCode?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    plantCode?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    plantCode?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    plantCode?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
