import { TurnishOptions } from '@/index';
import { NodeTypes } from '@/node';
import { isBlock, isTransparentWrapper, trimNewlines } from '@/utilities';

const genericBlockContainers = [
  'ARTICLE', 'ASIDE', 'CENTER', 'DIV', 'FOOTER', 'HEADER', 'MAIN', 'NAV', 'SECTION'
];

export function isList(node: Node): boolean {
  return node.nodeName === 'UL' || node.nodeName === 'OL';
}

function isBlankText(node: Node): boolean {
  return node.nodeType === NodeTypes.Text && /^\s*$/.test(node.nodeValue || '');
}

function hasSignificantText(node: Node): boolean {
  return Array.from(node.childNodes).some(child => child.nodeType === NodeTypes.Text && !isBlankText(child));
}

function isGenericBlockContainer(node: Node): boolean {
  return genericBlockContainers.includes(node.nodeName) && isBlock(node);
}

function containsOnlyLists(node: Node): boolean {
  const children = Array.from(node.childNodes).filter(child => !isBlankText(child));
  return children.length > 0 && children.every(child =>
    child.nodeType === NodeTypes.Element && isListContainer(child)
  );
}

function isListOnlyBlock(node: Node): boolean {
  return isGenericBlockContainer(node) && containsOnlyLists(node);
}

function isListContainer(node: Node): boolean {
  if (isList(node)) {
    return true;
  }
  return (isTransparentWrapper(node) || isGenericBlockContainer(node)) && containsOnlyLists(node);
}

function getOwnerListItem(list: Node): Element | null {
  let parent = list.parentNode;
  while (parent && (isTransparentWrapper(parent) || isListOnlyBlock(parent))) {
    parent = parent.parentNode;
  }
  return parent && parent.nodeName === 'LI' ? parent as Element : null;
}

function isLastElementWithin(node: Node, ancestor: Element): boolean {
  let current: Node = node;
  while (current !== ancestor) {
    const parent = current.parentNode as Element | null;
    if (!parent || parent.lastElementChild !== current) {
      return false;
    }
    current = parent;
  }
  return true;
}

export function isNestedListWrapper(node: Node): boolean {
  return isListOnlyBlock(node) && getOwnerListItem(node) !== null;
}

export function isTrailingNestedList(list: Node): boolean {
  const ownerListItem = getOwnerListItem(list);
  return ownerListItem !== null && isLastElementWithin(list, ownerListItem);
}

function listItemMarker(item: Node, options: TurnishOptions): string {
  const spacing = ' '.repeat(options.listMarkerSpaceCount);
  const parent = item.parentNode as Element;
  if (parent.nodeName !== 'OL') {
    return options.bulletListMarker + spacing;
  }
  const start = parent.getAttribute('start');
  const index = Array.prototype.indexOf.call(parent.children, item);
  return (start ? Number(start) + index : index + 1) + '.' + spacing;
}

function hasSingleContentBlock(item: Element): boolean {
  if (hasSignificantText(item)) {
    return false;
  }
  const contentChildren = Array.from(item.children).filter(child => !isListContainer(child));
  if (contentChildren.length !== 1 || !isBlock(contentChildren[0])) {
    return false;
  }

  let current = contentChildren[0];
  while (true) {
    const blocks = Array.from(current.children).filter(child => isBlock(child));
    if (blocks.length === 0) {
      return true;
    }
    if (blocks.length > 1 || hasSignificantText(current)) {
      return false;
    }
    current = blocks[0];
  }
}

function normalizeItemSpacing(content: string, item: Element): string {
  const endsWithBlock = /\n$/.test(content);
  content = trimNewlines(content);
  if (hasSingleContentBlock(item)) {
    return content.replace(/\n\s*\n/g, '\n');
  }
  return endsWithBlock ? content + '\n' : content;
}

export function renderListItem(content: string, item: Element, options: TurnishOptions): string {
  const indent = options.listItemIndent === 'tab' ? '\t' : ' '.repeat(options.listItemIndentSpaceCount);
  content = normalizeItemSpacing(content, item).replace(/\n/g, '\n' + indent);

  const hasOnlyNestedList = containsOnlyLists(item) && content.trim() !== '';
  const prefix = hasOnlyNestedList ? indent : listItemMarker(item, options);
  return prefix + content + (item.nextSibling ? '\n' : '');
}
