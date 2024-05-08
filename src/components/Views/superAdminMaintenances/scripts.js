import { dbQueryCols } from "../../../scripts/queries";
import { OrdAndFilt } from "../../../scripts/utils";

export const sitesSuperAdGetCompanies = async ()=> {
    var compsInfo = await dbQueryCols('company');
    if (compsInfo){
        compsInfo = OrdAndFilt.order(compsInfo, 'companyName');
    }
    return compsInfo;
};