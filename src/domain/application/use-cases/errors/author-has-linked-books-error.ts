import { UseCaseError } from '@/core/errors/use-case-error';

export class AuthorHasLinkedBooksError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Cannot delete author "${identifier}" because there are books linked to this author.`);
  }
}