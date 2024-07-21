import {err} from '../error';
import {
  CompletionMetadata,
  CompletionMode,
  CompletionRequest,
  CompletionResponse,
  EditorModel,
  EditorPosition,
  FetchCompletionItemParams,
} from '../types';
import {getTextAfterCursor, getTextBeforeCursor, HTTP} from '../utils';

const CONTENT_TYPE_JSON = 'application/json';

/**
 * Fetches a completion item from the groq API.
 * @param {FetchCompletionItemParams} params - The parameters for fetching the completion item.
 * @returns {Promise<string | null>} The completion item or null if an error occurs or the request is aborted.
 */
export const fetchCompletionItem = async ({
  filename,
  endpoint,
  language,
  technologies,
  externalContext,
  model,
  position,
}: FetchCompletionItemParams): Promise<string | null> => {
  try {
    const {completion} = await HTTP.POST<CompletionResponse, CompletionRequest>(
      endpoint,
      {
        completionMetadata: constructCompletionMetadata({
          filename,
          position,
          model,
          language,
          technologies,
          externalContext,
        }),
      },
      {
        headers: {'Content-Type': CONTENT_TYPE_JSON},
        error: 'Error while fetching completion item',
      },
    );

    return completion || null;
  } catch (error) {
    err(error).completionError('Error while fetching completion item');
    return null;
  }
};

/**
 * Constructs the metadata needed for fetching a completion item.
 */
export const constructCompletionMetadata = ({
  filename,
  position,
  model,
  language,
  technologies,
  externalContext,
}: Omit<
  FetchCompletionItemParams,
  'text' | 'endpoint' | 'token'
>): CompletionMetadata => {
  const completionMode = determineCompletionMode(position, model);

  const textBeforeCursor = getTextBeforeCursor(position, model);
  const textAfterCursor = getTextAfterCursor(position, model);

  return {
    filename,
    language,
    technologies,
    externalContext,
    textBeforeCursor,
    textAfterCursor,
    editorState: {completionMode},
  };
};

/**
 * Determines the completion mode based on the cursor position and editor model.
 * @param {EditorPosition} position - The cursor position in the editor.
 * @param {EditorModel} model - The editor model.
 * @returns {CompletionMode} The determined completion mode.
 */
const determineCompletionMode = (
  position: EditorPosition,
  model: EditorModel,
): CompletionMode => {
  const textBeforeCursor = getTextBeforeCursor(position, model);
  const textAfterCursor = getTextAfterCursor(position, model);

  return textBeforeCursor && textAfterCursor
    ? 'fill-in-the-middle'
    : 'completion';
};
