export default function parseGaml(text) {
    let graph = new Graph()
    let tokenizer = new Tokenizer(text)
    let currentGroup = new IndentGroup(graph, null, 0, [ new AnnotateVertex(null) ])
    let token = tokenizer.next()
    while (token !== null) {
        currentGroup = currentGroup.on(token)
    }
    do {
        currentGroup = currentGroup.close()
    } while (currentGroup !== null)
    return graph
}

export class Graph {
    vertices = {}
    edges = []
    declareVertex(name) {
        if (!this.vertices.hasOwnProperty(name)) {
            this.vertices[name] = { edges: {} }
        }
        return this.vertices[name]
    }
    createEdge(sourceVertex) {
        let edge = { from: sourceVertex, to: [], label: null, properties: {} }
        this.edges.push(edge)
        return edge
    }
}

export const CHILD_LABEL = "child of"

// Parser - puts it all together and creates a graph
// Tokenizer - reads , [ ] : -> <- > Vertex Name "String" and indents
// ParserGroup - reads [ , ] and indents, and uses them to create individual parse threads
// ParserThread - a stream of Vertex, PropertyAssignment, String, EventStart, EventEnd tokens

class ParserGroup {
    graph
    parent
    indent
    initialThreads
    threads
    constructor(graph, parent, indent=parent.indent, initialThreads=parent.threads) {
        this.parent = parent
        this.indent = indent
        this.initialThreads = this.threads = initialThreads
    }
    reset() {
        this.threads.forEach(thread => thread.close(this.graph))
        this.threads = this.initialThreads
    }
    on(token) {
        switch (token.type) {
            case '[':
                return new ArrayGroup(this)
            case ']':
                this.reset()
                return this.parent.on(token)
            case ',':
                this.reset()
                return this
            case '\n':
                // Indent
                if (token.indent > this.indent) {
                    return new IndentGroup(this, token.value)

                // Undent / Samedent
                } else {
                    this.reset()
                    return this.parent.on(token)
                }
            default:
                return this.threads.map(thread => thread.on(token))
        }
    }

    close() {
        this.reset()
        if (this.parent) {
            return this.parent.close()
        }
    }
}

class ArrayGroup extends ParserGroup {
    on(token) {
        if (token.type == ']') {
            this.reset()
            return this.parent
        }
        return super.on(token)
    }
}

class IndentGroup extends ParserGroup {
    on(token) {
        if (token.type == '\n' && token.indent == this.indent) {
            this.reset()
            return this
        }
        return super.on(token)
    }
}

// Parser
// ======
// - parent
// - indent
// - is array
// - threads: parent.threads
// - reset: threads.close; threads = parent.threads
// - close: reset; parent
//
// | [        | Parser(parent, indent, true)
// | ,        | reset
// | EOF      | while (parent) { close }
// | Indent   | Parser(parent, indent, false)
// | Undent   | close, parent.on(indent)
//
// if (is array)
// | ]        | close
// | Samedent | close, parent.on(indent)
//
// if (!is array)
// | ]        | close, parent.on(])
// | Samedent | reset

class ParseState {
    graph
    constructor(graph) {
        this.graph = graph
    }
    on(token) {
        throw `Unexpected token ${token}`
    }
    close() {
    }
}

//
// AnnotateVertex(vertex)
//
// Chromebook -> manufactured by ->     Google
//
// | Name   | AnnotateVertexName(vertex, name)
// | String | error
// | ->     | error
// | <-     | error
// | :      | error
//
class AnnotateVertex extends ParseState {
    vertex
    constructor(graph, vertex) { super(graph); this.vertex = vertex; }
    on(token) {
        switch (token.type) {
            case 'name':
                return new AnnotateVertexName(this.graph, this.vertex, token.name)
            case '>':
                return new AnnotateVertexExtendName(this.graph, this.vertex)
            default:
                return super.on(token)
        }
    }
}

//
// AnnotateVertexName(vertex, name)
//
// Chromebook         Screen
// Chromebook         -> manufactured by -> Google
// Chromebook Price   : "$1200" ]
//
// | Name   | AnnotateVertex(find or create vertex).on()
// | String | AnnotateVertex(find or create vertex).on()
// | ->     | CreateEdge(vertex, ->)
// | <-     | CreateEdge(vertex, ->)
// | :      | AnnotateVertexProperty(vertex, name)
//
class AnnotateVertexName extends ParseState {
    vertex
    name
    constructor(graph, vertex, name) { super(graph); this.vertex = vertex; this.name = name; }
    on(token) {
        switch (token.type) {
            case 'name':
            case 'string':
                let vertex = this.close()
                return new AnnotateVertex(vertex).on(token)
            case '->':
            case '<-':
                vertex = this.close()
                return new CreateEdge(vertex, token.type)
            case '>':
                vertex = this.close()
                return new AnnotateVertexExtendName(vertex)
            case ':':
                return new AnnotateVertexProperty(this.vertex, this.name)
            default:
                return super.on(token)
        }
    }
    close() {
        this.graph.declareVertex(this.name)
        return this.name
    }
}

//
// AnnotateVertexExtendName(vertex, name)
//
// Chromebook >       Screen
//
// | Name   | AnnotateVertex(find or create vertex).on()
// | String | AnnotateVertex(find or create vertex).on()
// | ->     | CreateEdge(vertex, ->)
// | <-     | CreateEdge(vertex, ->)
// | :      | AnnotateVertexProperty(vertex, name)
//
class AnnotateVertexExtendName extends ParseState {
    vertex
    constructor(vertex) { super(); this.vertex = vertex; }
    on(token, graph) {
        switch (token.type) {
            case 'name':
                return new AnnotateVertexName(this.vertex, `${this.vertex} > ${token.name}`)
            default:
                return super.on(token, graph)
        }
    }
}

//
// AnnotateVertexProperty(vertex, name)
//
// Price:           "$1200"
// Manufacturer:    Google
// 
// | Name   | find or create vertex, set property, AnnotateVertex(vertex)
// | String | set property, AnnotateVertex(vertex)
// | ->     | error
// | <-     | error
// | :      | error
//
class AnnotateVertexProperty extends ParseState {
    vertex
    name
    constructor(vertex, name) { super(); this.vertex = vertex; this.name = name; }
    on(token, graph) {
        switch (token.type) {
            case 'name':
                let name = ensureVertex(graph, token.name)
                graph.vertex(this.vertex)[this.name] = graph.vertex(name)
                return new AnnotateVertex(this.vertex)
            case 'string':
                graph.vertex(this.vertex)[this.name] = token.value
                return new AnnotateVertex(this.vertex)
            default:
                return super.on(token, graph)
        }
    }
}

//
// CreateEdge(vertex, direction)
//
// Chromebook ->    manufactured by -> Google
// 
// | Name   | AnnotateEdge(find or create edge)
// | String | error
// | ->     | error
// | <-     | error
// | :      | error
//
class CreateEdge extends ParseState {
    vertex
    direction
    constructor(vertex, direction) { super(); this.vertex = vertex; this.direction = direction; }
    on(token, graph) {
        switch (token.type) {
            case 'name':
                let edge = { v: this.vertex, w: }
                (this.vertex, value, this.direction == '->')
                return new AnnotateEdge(edge)
            default:
                return super.on(root, type, value)
        }
    }
}

//
// AnnotateEdge(edge data)
//
// Chromebook -> manufactured by   -> Google
// Chromebook <- manufactured by   Duration: "100 days" -> Google
// Chromebook <- mirrored by       -> Chromebook 2
//
// | Name   | AnnotateEdgePropertyName(edge, name)
// | String | error
// | ->     | CompleteEdge(edge, ->)
// | <-     | CompleteEdge(edge, <-)
// | :      | error
//
class AnnotateEdge extends ParseState {
    edge
    constructor(edge) { super(); this.edge = edge; }
    on(root, type, value) {
        switch (type) {
            case 'name':
                return new AnnotateEdgePropertyName(this.edge, value)
            case '->':
            case '<-':
                return new CompleteEdge(this.edge, type)
            default:
                return super.on(root, type, value)
        }
    }
}

//
// AnnotateEdgePropertyName(edge, name)
//
// Chromebook -> manufactured by [Duration    : "200 days"] -> Google
//
// | Name   | error
// | String | error
// | ->     | error
// | <-     | error
// | :      | AnnotateEdgeProperty(edge, name)
//
class AnnotateEdgePropertyName extends ParseState {
    edge
    name
    constructor(edge, name) { super(); this.edge = edge; this.name = name; }
    on(root, type, value) {
        switch (type) {
            case ':':
                return new AnnotateEdgeProperty(this.edge, this.name)
            default:
                return super.on(root, type, value)
        }
    }
}

//
// AnnotateEdgeProperty(edge, name)
//
// Chromebook -> manufactured by [OrderedThrough :     Amazon] -> Google
// Chromebook -> manufactured by [Duration :           "200 days"] -> Google
//
// | Name   | find or create vertex, set property, AnnotateEdge(edge data)
// | String | set property, Annotateedge(edge data)
// | ->     | error
// | <-     | error
// | :      | error
//
class AnnotateEdgeProperty extends ParseState {
    edge
    name
    constructor(edge, name) { super(); this.edge = edge; this.name = name; }
    on(root, type, value) {
        switch (type) {
            case 'name':
                let edge = setProperty(this.edge, findOrCreateVertex(root, value))
                return new AnnotateEdge(edge)
            case 'string':
                edge = setProperty(this.edge, eval(value))
                return new AnnotateEdge(edge)
            default:
                return super.on(root, type, value)
        }
    }
}

//
// CompleteEdge(edge, direction)
//
// Chromebook -> manufactured by ->   Google
//
// | Name   | AnnotateEdgePropertyName(edge, name)
// | String | error
// | ->     | error
// | <-     | errpr
// | :      | error
//
class CompleteEdge extends ParseState {
    edge
    direction
    constructor(edge, direction) { super(); this.edge = edge; this.direction = direction; }
    on(root, type, value) {
        switch (type) {
            case 'name':
                let vertex = findOrCreateVertex(root, value)
                completeEdge(this.edge, vertex, this.direction == '->')
                return new AnnotateVertex(vertex)
            default:
                return super.on(root, type, value)
        }
    }
}

class Tokenizer {
    // Input
    text

    // Output
    indent

    // Tracking
    index
    line
    lineStart
    column() {
        return (this.index - this.lineStart) + 1
    }

    constructor(text) {
        this.text = text
        this.index = 0
        this.line = 1
        this.lineStart = 0
    }

    next() {
        if (this.index == this.text.length()) { return null }
        if (this.index == 0) { return this.startLine() }

        this.skipSpace()
        // Handle special characters
        let ch = this.text.charAt(this.index)
        switch (ch) {
            case '[':
            case ']':
            case '{':
            case '}':
            case ':':
            case ',':
            case '>':
                this.index += 1
                return ch
            case '"':
                return this.parseString()
            case '-':
                if (this.text.charAt(this.index + 1) == '>') {
                    this.index += 2
                    return '->'
                }
            case '<':
                if (this.text.charAt(this.index + 1) == '-') {
                    this.index += 2
                    return '<-'
                }
        }

        // Anything else, is a vertex name
        return this.parseVertexName()
    }

    ch() {
        return this.text.charAt(this.index)
    }

    startLine() {
        // Find the first non-empty line and record its indent
        do {
            this.lineStart = this.index
            this.skipSpace()
            this.indent = (this.index - this.lineStart)
            this.skipComment()
        } while (this.skipLineEnding())

        // If we're at EOF, return null, otherwise return "newline" to indicate start of line
        if (this.index == this.text.length()) {
            return null
        } else {
            return '\n'
        }
    }

    parseString() {
        let match = this.text.substring(this.index).match(/^"(?:[^"\\]|\\.)*"?/m)
        return match[0]
    }
    parseVertexName() {
        let match = this.text.substring(this.index).match(/^(?:[^\[\]{},:">]|-(?!>)|<(?!-))*/)
        return match[0]
    }

    skipSpace() { return this.skip(/^\s*/) }
    skipComment() { return this.skip(/^\/\/.*/) }
    skipLineEnding() {
        let ch = this.text.charAt(this.index)
        switch (ch) {
            case '\n':
                this.index += 1
                return true
            case '\r':
                if (this.text.charAt(this.index+1) == '\n') {
                    this.index += 2
                } else {
                    this.index += 1
                }
                return true
            default:
            return false
        }
    }
    skip(regexp) {
        let match = this.text.substring(this.index).match(regexp)
        if (!match) { return false }
        this.index += match[0].length()
        return true
    }
}

class OpenLines {
    loader
    vertex
    constructor(loader) {
        this.loader = loader
        this.
    }


    // Line: Vertex (Connection Vertex)*
    // Vertex: VertexName Properties*
    // Properties: Property | { Property,* }
    // Property: PropertyName: VertexName|"String"|Number
    // Connection: <- Event <- | -> Event -> | <- Event -> | >
    // Event: EventName Properties*
    //
    // [] and \n<tab> split the line so we're processing multiple



    // File: Vertexs
    // Vertexs: Vertex*
    // Vertex: VertexName Entries*
    // Entries: Entry|[(Entry),+]
    // Entry: Vertex|Event|Todo
    // Todo: [ ] Description
    // Event: -> EventName Properties* -> | <- EventName Properties* <- | <- EventName Properties* ->

    // Noun: [^[\]:,]+
    // List ()

}