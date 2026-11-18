# 后端构建：先只拷贝项目文件做 restore（利用层缓存），再发布。
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Directory.Build.props ./
COPY src/Verinex.Api/Verinex.Api.csproj src/Verinex.Api/
COPY tests/Verinex.UnitTests/Verinex.UnitTests.csproj tests/Verinex.UnitTests/
COPY tests/Verinex.IntegrationTests/Verinex.IntegrationTests.csproj tests/Verinex.IntegrationTests/

RUN dotnet restore src/Verinex.Api/Verinex.Api.csproj

COPY . .
RUN dotnet publish src/Verinex.Api/Verinex.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_NOLOGO=true

EXPOSE 8080

COPY --from=build /app/publish .

# 使用镜像内置的非 root 用户运行
USER $APP_UID

ENTRYPOINT ["dotnet", "Verinex.Api.dll"]
