from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = ""
    secret_key: str
    access_token_expire_minutes: int = 1440

    # Variáveis nativas do Railway (preenchidas ao ligar o serviço MySQL);
    # usadas como alternativa quando DATABASE_URL não é definida manualmente.
    mysql_url: str = ""
    mysqlhost: str = ""
    mysqlport: str = "3306"
    mysqluser: str = ""
    mysqlpassword: str = ""
    mysqldatabase: str = ""

    @property
    def effective_database_url(self) -> str:
        if self.database_url:
            return self.database_url
        if self.mysql_url:
            return self.mysql_url
        if self.mysqlhost:
            return (
                f"mysql+pymysql://{self.mysqluser}:{self.mysqlpassword}"
                f"@{self.mysqlhost}:{self.mysqlport}/{self.mysqldatabase}?charset=utf8mb4"
            )
        raise RuntimeError(
            "Base de dados não configurada: defina DATABASE_URL (ou ligue o serviço MySQL do Railway)."
        )

    admin_name: str = "Administrador"
    admin_email: str = "admin@learncode.local"
    admin_password: str = "admin"

    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
