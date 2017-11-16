export class ServerPageInput {
    offset = 0;
    pageNo = 1;
    pageSize = 50;
    limit = 50;
    noPaging = true;
    query = {};
    serverPaging: boolean = true;
}
