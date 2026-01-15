export interface IGenerateTokenUseCase {
    execute(
        userId: string,
        email:string,
    ):Promise<{accessToken: string; refreshToken: string}>
}
