## 如何实现一个类似Copilot的代码续写



### 演示

1. typescript续写的演示
2. python续写的演示
3. shell续写的演示
4. sql续写的演示

### 核心点

以下的内容全部以sql续写作为举例

代码的续写触发与编辑器在光标的位置息息相关，只有选择在合适的位置触发续写，调用大模型的接口，是实现一个copilot类似体验的关键

github 的copilot续写触发行为常与以下几种续写位置有关 

#### 续写位置

研究续写的地方应该以一个什么样的地方开始， 以下<cursor>代表当前的续写位置

以下枚举出所有可能续写触发位置的情况

1. 空引号内容续写

   ```sql
   -- 引号的情况
   select `a`.`<cursor>` from your_tablename;
   ```

   这种情况需要补充返回对应的sql字段

   此时大模型的返回预测也会

   ```sql
   --- 第一种，大模型精确的返回了具体的字段补全，例如'id'
   此时大模型返回的文本应为
   ```sql\nid\n```
   这种直接补全进去即可，不需要特殊处理字符串
   
   --- 第二种，大模型补全了箭头后的sql内容，例如
   此时大模型返回的文本应为
   ```sql\nid` from your_tablename```
   这种情况需要补全的文本为 id 而后面匹配一致的文本去除
   
   --- 第三种，大模型返回了文本部分相同的字段
   ```sql\nid` from other_table``` 
   这种情况需要补全 id 而后面的文本from other_table与原本用户文本冲突不应补全
   
   --- 第五种， 接口报错，不应该续写
   ```

2. 空括号续写

   ```sql
   select count(<cursor>) from your_tablename;
   ```

   空括号的场景与空引号场景类似，这里就不予赘述

3. 行末尾续写

   ```sql
   --- 第一种情况,处于文本文件的末尾行尾给予续写
   select * from users <cursor>
   --- 这种情况，大模型会根据文件的全文进行推导出合适的语句，
   例如```sql\nwhere id =``` 或者 ```\n where```
   这种情况直接给予编辑器补全
   ```

   ```sql
   --- 第二种情况，处于文本文件的中间行的行尾，并且未有语句停止符号
   select * from users;
   select * from orgs <cursor>
   select * from sales where id = '1';
   --- 大模型会根据文件上下文进行推导合适语句，
   第一种，补全了当前行完整语句 ```sql\n where id = 0;```
   第二种，补全了当前行完整语句并且和还补全了和当前行下一行一样的语句例如 ```sql\n where id ='1\nselect *'```
   ```

4. 行开头续写

   由于用户光标的特性，光标常见与行末尾或者行种间，处于行开头的情况实际上非常少，包括copilot也不处理行开头的情况

#### Prompt编排的设计以及模型选择

prompt编排以及模型选择对于代码续写的功能来说尤为重要，一个好的模型可以很好的根据代码的语义进行合理的推断，同时给出合适的代码和对应的格式

以下是我的prompt编排设计，这块仅供参考

``````
const formatRelatedFiles = (
  relatedFiles: RelatedFile[] | undefined,
): string => {
  if (!relatedFiles?.length) return '';

  return relatedFiles
    .map(({path, content}) =>
      `
<related_file>
  <path>${path}</path>
  <content>
\`\`\`
${content}
\`\`\`
  </content>
</related_file>`.trim(),
    )
    .join('\n\n');
};


`You are an expert ${
    languageOrTechnologies ? `${languageOrTechnologies} ` : ''
  }AI code completion assistant. Generate precise, contextually-aware code completions by:

1. Analyzing code context, patterns and conventions
2. Determining appropriate completions based on mode and context
3. Ensuring proper formatting and style consistency
4. Respect the monaco editor's inline suggest subwordSmart mode

Context:
- File: ${filename || 'current file'}
- Language: ${language || 'detected from context'}
- Mode: ${completionMode}
- Technologies: ${languageOrTechnologies || 'inferred from context'}

Guidelines:
- Maintain consistent style and patterns
- Consider related files and context
- Follow mode-specific behavior (${completionMode}):
  ${
    completionMode === 'continue'
      ? '- Continue code naturally from cursor'
      : completionMode === 'insert'
        ? '- Insert precisely between segments'
        : '- Complete current code block'
  }`;

  const user = `Context:
1. Related Files:
${formatRelatedFiles(relatedFiles)}

2. Code State:
\`\`\`
${textBeforeCursor}<cursor>${textAfterCursor}
\`\`\`

Generate appropriate code completion at <cursor> position (Output only code without any comments or explanations):`;

``````

1. `relatedFiles`指出我的这个prompt可能存在多少种相关联的sql文件，这里使用xml的文本进行表示关联位置，这里是为了让大模型更好的理解上下文
2. <cursor>表示当前光标在文本的位置，`textBeforeCursor`表示光标前的文本，textAfterCursor表示的是光标后的文本
3. `technologies` 表示当前使用的技术栈
4. Respect the monaco editor's inline suggest subwordSmart mode  要求大模型遵循编辑器的基本原则，以及编辑器的环境

#### 逻辑流程图

![{F8A8B1DB-F14B-498D-B71F-D374F521B7A7}](C:\Users\jimmy\AppData\Local\Packages\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\TempState\ScreenClip\{F8A8B1DB-F14B-498D-B71F-D374F521B7A7}.png)



#### 代码目录



#### 模块作用



#### 关键API



#### 关键函数逻辑





#### 海森堡不确定原理



这是一个物理学原理

在里，**不确定性原理**（**uncertainty principle**，又译**测不准原理**）表明，粒子的[位置](https://zh.wikipedia.org/wiki/位置向量)与[动量](https://zh.wikipedia.org/wiki/動量)不可同时被确定，位置的不确定性越小，则动量的不确定性越大，反之亦然。[[1\]](https://zh.wikipedia.org/wiki/不确定性原理#cite_note-Hilgevoord_2016-1):引言对于不同的案例，不确定性的内涵也不一样，它可以是观察者对于某种数量的信息的缺乏程度，也可以是对于某种数量的测量误差大小，或者是一个[系综](https://zh.wikipedia.org/wiki/系綜)的类似制备的系统所具有的统计学扩散数值。

简单的说，它无法在不干扰一个粒子的情况下，去观察

