using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace FOApp.Admin.AdminService.Model
{
public  class ActPushLogAdminModel
{
public string LogId {get;set;}
public string UserId {get;set;}
public string CalendarId {get;set;}
public string LogDate {get;set;}
public string PushMessage {get;set;}
public string ReturnMessage {get;set;}
public string ReturnCode {get;set;}
}

}
