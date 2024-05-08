import { dbQueryById } from "../../../scripts/queries";



export const resetGetUserInfo = async (uId) => {
    var uInfo = await dbQueryById('uData', uId);
    uInfo.pass = null;
    uInfo.pass2 = null;
    return uInfo;
};