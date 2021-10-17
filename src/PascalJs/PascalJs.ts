
import { FileIO } from '../IO/FileIO';
import { ConsoleOutput } from '../IO/ConsoleOutput';
import { LexicalAnalyzer } from '../LexicalAnalyzer/LexicalAnalyzer';
import { SyntaxAnalyzer } from '../SyntaxAnalyzer/SyntaxAnalyzer';
import { Engine } from '../Semantics/Engine';
import { RuntimeError } from '../Errors/RuntimeError';
import { config } from './demoConfig';
import { TypesIds } from '../Semantics/Variables/TypesIds';
import { PascalJsConfig } from './types';

export class PascalJs {
    /**
     * @type Engine  
     */
    engine;

    error: RuntimeError;
    config: PascalJsConfig;

    constructor(config) {
        this.config = config;
    }

    runFile(filePath) {

        try {
            var fileIO = new FileIO(filePath,
                new ConsoleOutput()
            );
            var lexicalAnalyzer = new LexicalAnalyzer(fileIO);
            var syntaxAnalyzer = new SyntaxAnalyzer(lexicalAnalyzer);
            var tree = syntaxAnalyzer.analyze();
            var engine = new Engine(tree, this.config);
            engine.run();
        } catch (e) {

            if (e instanceof RuntimeError) {
                this.error = e;
            } else throw e;
        }


        this.engine = engine;
        return engine;
    }


    getVar(varName) {
        return this.engine.getCurrentScope().items[varName];
    }

    getVarValue(varName) {
        let variable = this.getVar(varName);
        
        if (variable.typeId === TypesIds.ARRAY) {
            return this.getVar(varName).items;
        } else  if (variable.typeId === TypesIds.ENUM) {
            return this.getVar(varName).value.symbol.stringValue;
        } else {
            return this.getVar(varName).value;
        }
    }

    getError() {
       return this.error;   
    }
}