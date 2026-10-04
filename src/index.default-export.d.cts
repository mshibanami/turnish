import api = require('./index.cjs');

declare class Turnish extends api.default {
    static default: typeof Turnish;
}

declare namespace Turnish {
    export import Rules = api.Rules;
    export import NodeTypes = api.NodeTypes;
    export import isCodeBlock = api.isCodeBlock;
    export import wrapInlineContent = api.wrapInlineContent;
    export type Rule = api.Rule;
    export type RuleFilter = api.RuleFilter;
    export type RuleFilterFunction = api.RuleFilterFunction;
    export type ExtendedNode = api.ExtendedNode;
    export type NodeType = api.NodeType;
    export type Plugin = api.Plugin;
    export type TurnishOptions = api.TurnishOptions;
}

export = Turnish;
