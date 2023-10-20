import { Component, OnDestroy, OnInit } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnDestroy, OnInit {
  public isLoading = false;
  public posts: Post[] = [];
  public totalPosts = 10;
  public postsPerPage = 2;
  public pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }

  onChagedPage(pageData: PageEvent) {
    
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
