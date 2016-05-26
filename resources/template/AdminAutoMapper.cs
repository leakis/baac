public class AdminAutoMapper
{
static AdminAutoMapper()
{
Mapper.CreateMap<ActCalendarAdminModel,ActCalendar>
Mapper.CreateMap<ActCalendar,ActCalendarAdminModel>
Mapper.CreateMap<ActPushLogAdminModel,ActPushLog>
Mapper.CreateMap<ActPushLog,ActPushLogAdminModel>
Mapper.CreateMap<ActUserAttentionAdminModel,ActUserAttention>
Mapper.CreateMap<ActUserAttention,ActUserAttentionAdminModel>
Mapper.CreateMap<AutoReplyRuleAdminModel,AutoReplyRule>
Mapper.CreateMap<AutoReplyRule,AutoReplyRuleAdminModel>
Mapper.CreateMap<GiftPackageAdminModel,GiftPackage>
Mapper.CreateMap<GiftPackage,GiftPackageAdminModel>
Mapper.CreateMap<GiftPackageMappingAdminModel,GiftPackageMapping>
Mapper.CreateMap<GiftPackageMapping,GiftPackageMappingAdminModel>
Mapper.CreateMap<GiftPropAdminModel,GiftProp>
Mapper.CreateMap<GiftProp,GiftPropAdminModel>
Mapper.CreateMap<RuleEventAdminModel,RuleEvent>
Mapper.CreateMap<RuleEvent,RuleEventAdminModel>
Mapper.CreateMap<RuleWordAdminModel,RuleWord>
Mapper.CreateMap<RuleWord,RuleWordAdminModel>
Mapper.CreateMap<SendGiftLogAdminModel,SendGiftLog>
Mapper.CreateMap<SendGiftLog,SendGiftLogAdminModel>
Mapper.CreateMap<UserBaseInfoAdminModel,UserBaseInfo>
Mapper.CreateMap<UserBaseInfo,UserBaseInfoAdminModel>
Mapper.CreateMap<UserGameCharacterAdminModel,UserGameCharacter>
Mapper.CreateMap<UserGameCharacter,UserGameCharacterAdminModel>
Mapper.CreateMap<UserScoreLogsAdminModel,UserScoreLogs>
Mapper.CreateMap<UserScoreLogs,UserScoreLogsAdminModel>
Mapper.CreateMap<UserSignInActivesAdminModel,UserSignInActives>
Mapper.CreateMap<UserSignInActives,UserSignInActivesAdminModel>
Mapper.CreateMap<UserSignInLogAdminModel,UserSignInLog>
Mapper.CreateMap<UserSignInLog,UserSignInLogAdminModel>
Mapper.CreateMap<UserSubscribeLogAdminModel,UserSubscribeLog>
Mapper.CreateMap<UserSubscribeLog,UserSubscribeLogAdminModel>
 public static T2 To<T1, T2>(T1 t)
{
    return Mapper.Map<T1, T2>(t);
}
}

}
