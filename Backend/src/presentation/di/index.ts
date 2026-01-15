import { RepositoryRegistry } from "./repository_registry";
import { ServiceRegistry } from "./service_registry";
import { UseCaseRegistry } from "./usecase_registry";


export class DependencyInjection {
    static registerAll() : void{
        UseCaseRegistry.registerUseCases();
         RepositoryRegistry.registerRepositories();
         ServiceRegistry.registerServices()
    }
}